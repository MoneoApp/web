import { useRouter } from 'next/router';

export default function Customer() {
  const { push, query: { id } } = useRouter();
  return (
    <>
      <h1>Customer: {id}</h1>
    </>
  )
}
