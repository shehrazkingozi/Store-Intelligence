import TopNavbar from "@/components/TopNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc"}}>
      <TopNavbar />
      <div style={{flex: 1, overflowY: "auto"}}>
        {children}
      </div>
    </div>
  );
}
