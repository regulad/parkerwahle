const body = JSON.stringify({
  "m.homeserver": {
    "base_url": "https://matrix.regulad.xyz"
  },
  "m.identity_server": {
    "base_url": "https://matrix.org"
  },
  "org.matrix.msc4143.rtc_foci": [
    {
      "type": "livekit",
      "livekit_service_url": "https://livekit.regulad.xyz/livekit/jwt"
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