interface ProfileProps {
  image?: string
  nickname: string
  greeting: string
  github: string
  email?: string
  coffeeUrl?: string
  onCoffeeClick?: () => void
}

export default function Profile({
  image = '/profile.jpg',
  nickname,
  greeting,
  github,
  email,
  coffeeUrl = 'https://buymeacoffee.com/hoonsdev',
  onCoffeeClick
}: ProfileProps) {
  const githubUrl = github.startsWith('http') ? github : `https://github.com/${github}`
  const githubUsername = github.replace(/^https?:\/\/github\.com\//, '')

  return (
    <div
      className="p-8 flex flex-col gap-8 h-full"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="w-24 h-24 overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
          <img
            src={image}
            alt={nickname}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e0e0e0" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="%23666"%3E%3F%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>

        <div>
          <h1
            className="text-xl font-semibold mb-3"
            style={{ color: 'var(--foreground)' }}
          >
            {nickname}
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {greeting}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
            style={{ color: 'var(--foreground)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            {githubUsername}
          </a>

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
              style={{ color: 'var(--foreground)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {email}
            </a>
          )}
        </div>
      </div>

      <div className="mt-auto">
        {onCoffeeClick ? (
          <button
            onClick={onCoffeeClick}
            className="w-full py-3 px-6 text-center text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--surface)'
            }}
          >
            개발자 커피 한잔 사주기
          </button>
        ) : (
          <a
            href={coffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 px-6 text-center text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--surface)'
            }}
          >
            개발자 커피 한잔 사주기
          </a>
        )}
      </div>
    </div>
  )
}
