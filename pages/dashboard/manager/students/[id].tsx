import { useEffect } from "react";
import { useRouter } from 'next/router';
import Layout from "../../../../components/layout/layout";

export default function Page(props: { id: number }) {
  const router = useRouter();
  const { id } = router.query
  const slug = router.query.slug || []
  useEffect(() => {
  })
  return (
    <>
      <Layout>
        <h1>{id}</h1>
        <h2>Slug: {slug.join('/')}</h2>
      </Layout>
    </>
  )
}