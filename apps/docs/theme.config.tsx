import './globals.css'

export default {
  logo: (
    <div className="flex items-center gap-2">
      <svg width="24" height="28" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 0L80 24V72L40 96L0 72V24L40 0Z" fill="#1a1a1a"/>
        <path d="M40 20L65 35V61L40 76L15 61V35L40 20Z" fill="white" opacity="0.2"/>
      </svg>
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold">Sigil Protocol</span>
    </div>
  ),
  project: {
    link: 'https://github.com/sigil-xyz/sigil'
  },
  docsRepositoryBase: 'https://github.com/sigil-xyz/sigil/blob/main/apps/docs',
  footer: {
    content: (
      <span>
        {new Date().getFullYear()} © Sigil Protocol. Built for the agent economy.
      </span>
    )
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Sigil'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Sigil" />
      <meta property="og:description" content="Identity and trust for AI agents" />
    </>
  ),
  feedback: {
    content: null
  },
  editLink: {
    content: 'Edit this page on GitHub'
  }
}
