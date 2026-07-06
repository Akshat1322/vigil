export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="shatter-assemble w-full h-full min-h-screen">
      {children}
    </div>
  );
}
