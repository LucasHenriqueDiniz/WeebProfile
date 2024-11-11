import { IoArrowBackOutline } from "react-icons/io5"
import Button from "web-client/components/Button/Button"
import NotFound from "web-client/components/NotFound"

const Page404 = () => {
  return (
    <NotFound
      message="The page you are looking for does not exist."
      heading="Page Not Found"
      buttons={
        <Button variant="primary" size="lg" beforeIcon={<IoArrowBackOutline />}>
          Back Home
        </Button>
      }
    />
  )
}

export default Page404
