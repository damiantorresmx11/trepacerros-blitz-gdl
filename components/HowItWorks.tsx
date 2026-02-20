'use client'

export function HowItWorks() {
  const steps = [
    { number: '01', title: 'Connect', description: 'Google, Email or Wallet' },
    { number: '02', title: 'Fund', description: 'Get MON from faucet' },
    { number: '03', title: 'Mint', description: 'Choose your items' },
    { number: '04', title: 'Own', description: 'NFTs on Monad' },
  ]

  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold mb-8 text-center text-white">How It Works</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 text-center hover:border-monad-purple/40 transition-all"
          >
            <div className="text-monad-purple text-xs font-mono mb-2">{step.number}</div>
            <div className="font-bold text-white mb-1">{step.title}</div>
            <div className="text-gray-400 text-sm">{step.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
