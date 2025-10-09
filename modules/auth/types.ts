export type SignInResponse = {
  status: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}
