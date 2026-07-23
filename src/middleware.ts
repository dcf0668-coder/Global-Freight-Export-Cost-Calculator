setAll(
  cookiesToSet: {
    name: string
    value: string
    options?: {
      path?: string
      maxAge?: number
      expires?: Date
      httpOnly?: boolean
      secure?: boolean
      sameSite?: boolean | 'lax' | 'strict' | 'none'
    }
  }[]
) {