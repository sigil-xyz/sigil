import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sigil-docs-root">
      {children}
    </div>
  )
}
