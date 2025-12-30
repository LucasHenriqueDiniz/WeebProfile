import ErrorScreen from "@/components/loading/ErrorScreen"

export default function NotFound() {
  return (
    <ErrorScreen
      title="404"
      message="A página que você está procurando não foi encontrada."
      showHomeButton={true}
    />
  )
}
















