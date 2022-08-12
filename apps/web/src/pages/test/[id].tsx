import { useRouter } from 'next/router'

export default function ID(): JSX.Element {
  const router = useRouter()
  const { id } = router.query

  return <p>Post: {id}</p>
}
