"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Banknote, Bell, Building2, Calculator, ChevronRight,
  CircleDollarSign, ClipboardCheck, FileCheck2, FileText, Gauge,
  LayoutDashboard, Menu, Plus, Search, Settings, Users, WalletCards, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type View = "Tổng quan" | "Báo giá" | "Hợp đồng" | "Công nợ" | "Tài chính";
type Quote = { id: number; code: string; customer: string; project: string; capacity: number; stops: number; value: number; status: string; updatedAt: string };
const LOCAL_QUOTES_KEY = "trung-duc-flow-quotes-v1";

const demoQuotes: Quote[] = [
  { id: -1, code: "BG-2609-015", customer: "Công ty Minh Phát", project: "Tòa nhà văn phòng Kinh Bắc", capacity: 630, stops: 6, value: 1180000000, status: "Chờ duyệt", updatedAt: "09/09/2026" },
  { id: -2, code: "BG-2609-014", customer: "Anh Nguyễn Minh Đức", project: "Nhà ở gia đình", capacity: 350, stops: 4, value: 795000000, status: "Đã gửi", updatedAt: "08/09/2026" },
  { id: -3, code: "BG-2609-013", customer: "Khách sạn Đông Đô", project: "Khối lưu trú 9 tầng", capacity: 1000, stops: 9, value: 2640000000, status: "Đã chốt", updatedAt: "06/09/2026" },
];

const contracts = [
  { code: "HĐ-2609-006", customer: "Công ty Minh Phát", value: 1180000000, paid: 354000000, debt: 826000000, stage: "Sản xuất thiết bị", due: "25/09/2026", health: "Đúng hạn" },
  { code: "HĐ-2608-011", customer: "Khách sạn Đông Đô", value: 2640000000, paid: 1848000000, debt: 792000000, stage: "Lắp đặt", due: "18/09/2026", health: "Sắp đến hạn" },
  { code: "HĐ-2607-009", customer: "Chú Trần Văn Hải", value: 730000000, paid: 730000000, debt: 0, stage: "Đã bàn giao", due: "—", health: "Hoàn tất" },
];

const nav: { label: View; icon: typeof LayoutDashboard }[] = [
  { label: "Tổng quan", icon: LayoutDashboard }, { label: "Báo giá", icon: Calculator },
  { label: "Hợp đồng", icon: FileCheck2 }, { label: "Công nợ", icon: WalletCards }, { label: "Tài chính", icon: Gauge },
];
const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
const compactMoney = (value: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value / 1_000_000_000)} tỷ`;

function StatusBadge({ status }: { status: string }) {
  const tone = status === "Đã chốt" || status === "Hoàn tất" || status === "Đúng hạn" ? "status-green" : status === "Sắp đến hạn" ? "status-amber" : "status-blue";
  return <Badge variant="outline" className={tone}>{status}</Badge>;
}

export function ElevatorFlowApp() {
  const [view, setView] = useState<View>("Tổng quan");
  const [mobileNav, setMobileNav] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>(demoQuotes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_QUOTES_KEY);
      if (saved) {
        const localQuotes = JSON.parse(saved) as Quote[];
        if (Array.isArray(localQuotes)) setQuotes([...localQuotes, ...demoQuotes]);
      }
    } catch {
      // Giữ dữ liệu mẫu nếu trình duyệt chặn localStorage hoặc dữ liệu cũ bị lỗi.
    }
  }, []);

  const heading = useMemo(() => view === "Tổng quan" ? "Tổng quan điều hành" : view, [view]);

  async function createQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setNotice("");
    const form = new FormData(event.currentTarget);
    const quantity = Number(form.get("quantity") || 1);
    const unitPrice = Number(form.get("unitPrice") || 0);
    const discount = Number(form.get("discount") || 0);
    const vat = Number(form.get("vat") || 0);
    const subtotal = quantity * unitPrice * (1 - discount / 100);
    const input = {
      customer: String(form.get("customer") || ""), contact: String(form.get("contact") || ""), phone: String(form.get("phone") || ""),
      project: String(form.get("project") || ""), address: String(form.get("address") || ""), liftType: String(form.get("liftType") || "Thang gia đình"),
      brand: String(form.get("brand") || ""), capacity: Number(form.get("capacity") || 0), stops: Number(form.get("stops") || 0), speed: Number(form.get("speed") || 1),
      quantity, unitPrice, discount, vat, value: Math.round(subtotal * (1 + vat / 100)), validityDays: Number(form.get("validityDays") || 15),
    };
    try {
      const now = new Date();
      const localQuote: Quote = {
        id: now.getTime(),
        code: `BG-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-4)}`,
        customer: input.customer,
        project: input.project,
        capacity: input.capacity,
        stops: input.stops,
        value: input.value,
        status: "Bản nháp",
        updatedAt: new Intl.DateTimeFormat("vi-VN").format(now),
      };
      setQuotes((current) => {
        const localQuotes = [localQuote, ...current.filter((quote) => quote.id > 0)];
        window.localStorage.setItem(LOCAL_QUOTES_KEY, JSON.stringify(localQuotes));
        return [localQuote, ...current];
      });
      setNotice(`Đã tạo ${localQuote.code} và lưu trên thiết bị này`); setDialogOpen(false); setView("Báo giá");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Không thể lưu báo giá"); }
    finally { setSaving(false); }
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand-lockup"><div className="brand-mark"><Building2 size={21} /></div><div><strong>TRUNG ĐỨC FLOW</strong><span>Quản trị thang máy</span></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Đóng menu"><X size={20} /></button></div>
      <nav aria-label="Điều hướng chính"><p className="nav-label">Vận hành</p>{nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${view === label ? "active" : ""}`} onClick={() => { setView(label); setMobileNav(false); }}><Icon size={18} /><span>{label}</span>{view === label && <ChevronRight size={16} className="nav-chevron" />}</button>)}<p className="nav-label nav-second">Hệ thống</p><button className="nav-item"><Users size={18} /><span>Khách hàng</span></button><button className="nav-item"><Settings size={18} /><span>Cài đặt</span></button></nav>
      <div className="sidebar-foot"><div className="avatar">NA</div><div><strong>Nguyễn An</strong><span>Giám đốc</span></div></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Đóng menu" />}
    <main className="main-panel">
      <header className="topbar"><div className="topbar-title"><button className="menu-button" onClick={() => setMobileNav(true)} aria-label="Mở menu"><Menu size={21} /></button><div><span>09 tháng 9, 2026</span><h1>{heading}</h1></div></div><div className="topbar-actions"><label className="searchbox"><Search size={17} /><input aria-label="Tìm kiếm" placeholder="Tìm mã, khách hàng..." /></label><button className="icon-button" aria-label="Thông báo"><Bell size={18} /><i /></button><QuoteDialog open={dialogOpen} setOpen={setDialogOpen} onSubmit={createQuote} saving={saving} /></div></header>
      <section className="content">{notice && <div className="notice">{notice}</div>}{view === "Tổng quan" && <Dashboard quotes={quotes} onView={setView} />}{view === "Báo giá" && <Quotes quotes={quotes} onNew={() => setDialogOpen(true)} />}{view === "Hợp đồng" && <Contracts />}{view === "Công nợ" && <Receivables />}{view === "Tài chính" && <Finance />}</section>
    </main>
  </div>;
}

function QuoteDialog({ open, setOpen, onSubmit, saving }: { open: boolean; setOpen: (v: boolean) => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void; saving: boolean }) {
  const [quantity, setQuantity] = useState(1), [unitPrice, setUnitPrice] = useState(420000000), [discount, setDiscount] = useState(0), [vat, setVat] = useState(8);
  const subtotal = quantity * unitPrice, afterDiscount = subtotal * (1 - discount / 100), total = afterDiscount * (1 + vat / 100);
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="primary-action"><Plus />Tạo báo giá</Button></DialogTrigger><DialogContent className="quote-dialog"><DialogHeader><DialogTitle>Tạo báo giá thang máy</DialogTitle><DialogDescription>Theo mẫu báo giá: khách hàng, công trình, hạng mục thang và điều kiện thương mại.</DialogDescription></DialogHeader><form onSubmit={onSubmit} className="quote-form"><h3>Thông tin khách hàng</h3><Field label="Khách hàng / Công ty" name="customer" required /><Field label="Người liên hệ" name="contact" /><Field label="Số điện thoại" name="phone" type="tel" /><Field label="Email" name="email" type="email" /><Field label="Tên công trình / dự án" name="project" required wide /><Field label="Địa chỉ công trình" name="address" wide />
    <h3>Hạng mục thang máy</h3><label className="field"><span>Loại thang</span><select name="liftType" defaultValue="Thang gia đình"><option>Thang gia đình</option><option>Thang tải khách</option><option>Thang tải hàng</option><option>Thang bệnh viện</option><option>Thang quan sát</option></select></label><Field label="Xuất xứ / thương hiệu" name="brand" /><Field label="Tải trọng (kg)" name="capacity" type="number" defaultValue="450" required /><Field label="Số điểm dừng" name="stops" type="number" defaultValue="5" required /><label className="field"><span>Tốc độ (m/s)</span><select name="speed" defaultValue="1"><option value="0.5">0,5 m/s</option><option value="1">1 m/s</option><option value="1.5">1,5 m/s</option><option value="1.75">1,75 m/s</option><option value="2">2 m/s</option></select></label><label className="field"><span>Số lượng (bộ)</span><Input name="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></label><label className="field field-wide"><span>Đơn giá / bộ (VNĐ)</span><Input name="unitPrice" type="number" min="1" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} /></label>
    <h3>Điều kiện báo giá</h3><Field label="Hiệu lực (ngày)" name="validityDays" type="number" defaultValue="15" /><label className="field"><span>Chiết khấu (%)</span><Input name="discount" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></label><label className="field"><span>VAT (%)</span><Input name="vat" type="number" min="0" max="20" value={vat} onChange={(e) => setVat(Number(e.target.value))} /></label><label className="field field-wide"><span>Ghi chú thêm</span><textarea name="notes" placeholder="Điều kiện giao hàng, lắp đặt, bảo hành..." /></label>
    <div className="quote-total"><span><small>Tạm tính</small><strong>{money(subtotal)}</strong></span><span><small>Sau chiết khấu</small><strong>{money(afterDiscount)}</strong></span><span className="grand-total"><small>Tổng thanh toán</small><strong>{money(total)}</strong></span></div><DialogFooter className="field-wide"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu báo giá"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, name, type = "text", required, wide, defaultValue }: { label: string; name: string; type?: string; required?: boolean; wide?: boolean; defaultValue?: string }) { return <label className={`field ${wide ? "field-wide" : ""}`}><span>{label}</span><Input name={name} type={type} required={required} defaultValue={defaultValue} /></label>; }

function Dashboard({ quotes, onView }: { quotes: Quote[]; onView: (v: View) => void }) { return <>
  <div className="kpi-grid"><Kpi icon={FileCheck2} label="Hợp đồng đã ký" value="4,55 tỷ" note="3 hợp đồng đang triển khai" tone="blue" /><Kpi icon={CircleDollarSign} label="Đã thu tháng này" value="1,32 tỷ" note="68% kế hoạch tháng" tone="green" progress={68} /><Kpi icon={WalletCards} label="Công nợ phải thu" value="1,62 tỷ" note="210 triệu đã quá hạn" tone="orange" /><Kpi icon={ClipboardCheck} label="Dự án đang lắp đặt" value="7" note="2 dự án sắp bàn giao" tone="navy" /></div>
  <div className="dashboard-grid"><section className="panel pipeline-panel"><PanelHead eyebrow="Luồng kinh doanh" title="Từ cơ hội đến dòng tiền" action={() => onView("Báo giá")} /><div className="pipeline"><Pipeline icon={Calculator} label="Báo giá" count="12" value="8,2 tỷ" color="#3157c8" /><ChevronRight className="flow-arrow" /><Pipeline icon={FileText} label="Chờ ký HĐ" count="4" value="3,1 tỷ" color="#7055c8" /><ChevronRight className="flow-arrow" /><Pipeline icon={Building2} label="Đang thi công" count="7" value="5,9 tỷ" color="#d88928" /><ChevronRight className="flow-arrow" /><Pipeline icon={Banknote} label="Chờ thu" count="5" value="1,62 tỷ" color="#15956b" /></div></section><section className="panel attention-panel"><div className="panel-head"><div><p>Cần xử lý</p><h2>Việc ưu tiên hôm nay</h2></div><span className="attention-count">4</span></div><Attention title="Duyệt báo giá BG-2609-015" meta="Công ty Minh Phát · 1,18 tỷ" tone="blue" /><Attention title="Nhắc thanh toán đợt 3" meta="Khách sạn Đông Đô · 528 triệu" tone="orange" /><Attention title="Nghiệm thu lắp đặt" meta="HĐ-2608-007 · 14:30 hôm nay" tone="green" /></section></div>
  <section className="panel recent-panel"><PanelHead eyebrow="Mới cập nhật" title="Báo giá gần đây" action={() => onView("Báo giá")} /><QuoteTable quotes={quotes.slice(0, 4)} /></section>
  </>; }

function Kpi({ icon: Icon, label, value, note, tone, progress }: { icon: typeof FileText; label: string; value: string; note: string; tone: string; progress?: number }) { return <article className="kpi-card"><div className={`kpi-icon ${tone}`}><Icon size={20} /></div><div className="kpi-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small>{progress && <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>}</div></article>; }
function PanelHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: () => void }) { return <div className="panel-head"><div><p>{eyebrow}</p><h2>{title}</h2></div>{action && <button onClick={action}>Xem chi tiết <ArrowRight size={15} /></button>}</div>; }
function Pipeline({ icon: Icon, label, count, value, color }: { icon: typeof FileText; label: string; count: string; value: string; color: string }) { return <div className="pipeline-step"><span className="pipeline-icon" style={{ color, backgroundColor: `${color}12` }}><Icon size={20} /></span><div><small>{label}</small><strong>{count} <em>hồ sơ</em></strong><span>{value}</span></div></div>; }
function Attention({ title, meta, tone }: { title: string; meta: string; tone: string }) { return <button className="attention-item"><span className={`attention-dot ${tone}`} /><span><strong>{title}</strong><small>{meta}</small></span><ChevronRight size={16} /></button>; }

function Quotes({ quotes, onNew }: { quotes: Quote[]; onNew: () => void }) { return <section className="panel list-panel"><div className="page-intro"><div><p>Quản lý từ lúc khảo sát đến khi chốt</p><h2>{quotes.length} báo giá</h2></div><Button onClick={onNew}><Plus />Báo giá mới</Button></div><QuoteTable quotes={quotes} /></section>; }
function QuoteTable({ quotes }: { quotes: Quote[] }) { return <Table><TableHeader><TableRow><TableHead>Mã báo giá</TableHead><TableHead>Khách hàng / Công trình</TableHead><TableHead>Cấu hình</TableHead><TableHead className="text-right">Giá trị</TableHead><TableHead>Trạng thái</TableHead><TableHead>Cập nhật</TableHead></TableRow></TableHeader><TableBody>{quotes.map((q) => <TableRow key={`${q.id}-${q.code}`}><TableCell><strong className="code-cell">{q.code}</strong></TableCell><TableCell><strong>{q.customer}</strong><small className="cell-sub">{q.project}</small></TableCell><TableCell>{q.capacity} kg · {q.stops} điểm dừng</TableCell><TableCell className="text-right font-semibold">{compactMoney(q.value)}</TableCell><TableCell><StatusBadge status={q.status} /></TableCell><TableCell className="text-muted-foreground">{q.updatedAt}</TableCell></TableRow>)}</TableBody></Table>; }

function Contracts() { const terms=[{n:"01",title:"Ký hợp đồng",text:"Tạm ứng theo số tiền thỏa thuận"},{n:"02",title:"Chốt sản xuất",text:"Đủ 50% lũy kế sau bàn giao giếng thang"},{n:"03",title:"Tập kết thiết bị",text:"Thanh toán 40% trước khi lắp đặt"},{n:"04",title:"Nghiệm thu bàn giao",text:"Thanh toán 10% còn lại"}]; return <><section className="panel contract-flow"><div className="page-intro"><div><p>Mẫu hợp đồng bạn cung cấp</p><h2>Tiến độ thanh toán 4 kỳ</h2></div><Badge variant="outline">Bảo hành · Bảo trì 18 tháng</Badge></div><div className="contract-terms">{terms.map((term)=><div className="term-card" key={term.n}><span>{term.n}</span><div><strong>{term.title}</strong><small>{term.text}</small></div></div>)}</div><div className="contract-meta"><span><strong>50 ngày</strong> giao thiết bị</span><span><strong>20 ngày</strong> lắp đặt vận hành</span><span><strong>10 ngày</strong> kiểm định bàn giao</span></div></section><section className="panel list-panel"><div className="page-intro"><div><p>Theo dõi thực hiện và thanh toán theo tiến độ</p><h2>Hợp đồng thang máy</h2></div><Button><Plus />Tạo hợp đồng</Button></div><Table><TableHeader><TableRow><TableHead>Mã hợp đồng</TableHead><TableHead>Khách hàng</TableHead><TableHead>Tiến độ hiện tại</TableHead><TableHead className="text-right">Giá trị</TableHead><TableHead className="text-right">Đã thu</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader><TableBody>{contracts.map((c) => <TableRow key={c.code}><TableCell><strong className="code-cell">{c.code}</strong></TableCell><TableCell className="font-medium">{c.customer}</TableCell><TableCell><strong>{c.stage}</strong><small className="cell-sub">Hạn kế tiếp: {c.due}</small></TableCell><TableCell className="text-right">{compactMoney(c.value)}</TableCell><TableCell className="text-right font-semibold">{compactMoney(c.paid)}</TableCell><TableCell><StatusBadge status={c.health} /></TableCell></TableRow>)}</TableBody></Table></section></>; }

function Receivables() { return <><div className="kpi-grid debt-grid"><Kpi icon={WalletCards} label="Tổng phải thu" value="1,62 tỷ" note="5 khoản chưa tất toán" tone="orange" /><Kpi icon={Banknote} label="Đến hạn 7 ngày" value="528 triệu" note="1 đợt thanh toán" tone="blue" /><Kpi icon={CircleDollarSign} label="Quá hạn" value="210 triệu" note="Quá hạn 12 ngày" tone="orange" /></div><section className="panel list-panel"><div className="page-intro"><div><p>Sale và kế toán cùng theo dõi trên một số liệu</p><h2>Lịch thu tiền theo hợp đồng</h2></div><Button variant="outline">Xuất đối soát</Button></div><Table><TableHeader><TableRow><TableHead>Hợp đồng</TableHead><TableHead>Khách hàng</TableHead><TableHead>Đợt thanh toán</TableHead><TableHead>Hạn thu</TableHead><TableHead className="text-right">Phải thu</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader><TableBody><DebtRow code="HĐ-2608-011" customer="Khách sạn Đông Đô" phase="Đợt 3 · Hoàn tất lắp đặt" due="18/09/2026" value={528000000} status="Sắp đến hạn" /><DebtRow code="HĐ-2606-004" customer="Công ty An Thịnh" phase="Đợt 4 · Bàn giao" due="28/08/2026" value={210000000} status="Quá hạn 12 ngày" /></TableBody></Table></section></>; }
function DebtRow({ code, customer, phase, due, value, status }: { code: string; customer: string; phase: string; due: string; value: number; status: string }) { return <TableRow><TableCell className="font-semibold">{code}</TableCell><TableCell>{customer}</TableCell><TableCell>{phase}</TableCell><TableCell>{due}</TableCell><TableCell className="text-right font-semibold">{money(value)}</TableCell><TableCell>{status.startsWith("Quá") ? <Badge variant="outline" className="status-red">{status}</Badge> : <StatusBadge status={status} />}</TableCell></TableRow>; }

function Finance() { const bars = [44,58,51,72,63,88,75,92,68], values=[310,425,370,615,520,790,645,860,590]; return <><div className="kpi-grid debt-grid"><Kpi icon={CircleDollarSign} label="Doanh thu ghi nhận" value="3,44 tỷ" note="Từ hợp đồng đã nghiệm thu" tone="green" /><Kpi icon={Banknote} label="Tiền đã thu" value="2,76 tỷ" note="80,2% doanh thu" tone="blue" /><Kpi icon={WalletCards} label="Còn phải thu" value="1,62 tỷ" note="Quá hạn 210 triệu" tone="orange" /></div><div className="finance-layout"><section className="panel chart-panel"><PanelHead eyebrow="Dòng tiền 9 tháng" title="Thu tiền thực tế" /><div className="bar-chart">{bars.map((height, i) => <div className="bar-column" key={i}><span style={{ height: `${height}%` }}><i>{values[i]}</i></span><small>T{i+1}</small></div>)}</div></section><section className="panel summary-panel"><PanelHead eyebrow="Cơ cấu" title="Giá trị hợp đồng" /><div className="donut"><div><strong>5,92</strong><span>tỷ đồng</span></div></div><div className="legend"><span><i className="legend-blue" />Đang thực hiện <strong>58%</strong></span><span><i className="legend-green" />Đã bàn giao <strong>22%</strong></span><span><i className="legend-gray" />Chờ khởi công <strong>20%</strong></span></div></section></div></>; }
