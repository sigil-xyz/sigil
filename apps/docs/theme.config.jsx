export default {
  logo: <span>Sigil Documentation</span>,
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
