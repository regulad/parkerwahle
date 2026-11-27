import { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const url = new URL('https://mastodon.regulad.xyz/.well-known/webfinger')
  const resource = request.nextUrl.searchParams.get('resource')
  if (resource) url.searchParams.set('resource', resource)

  return new Response(null, {
    status: 301,
    headers: {
      'Location': url.toString(),
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
