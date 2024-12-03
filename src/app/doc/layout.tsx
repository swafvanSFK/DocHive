import LiveBlocksProvider from "@/components/LiveblocksProvider"

const PageLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <LiveBlocksProvider>{children}</LiveBlocksProvider>
  )
}
export default PageLayout