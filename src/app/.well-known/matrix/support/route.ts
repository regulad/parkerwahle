const body = JSON.stringify({
  "contacts": [
    {
      "matrix_id": "@regulad:regulad.xyz",
      "role": "m.role.admin"
    }
  ]
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