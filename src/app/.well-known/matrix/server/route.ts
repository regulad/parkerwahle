const body = JSON.stringify({
  "m.server": "matrix.regulad.xyz:443"
})

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
