import Image from "next/image"
import { notFound } from "web-client/public"

const PluginNotFound = ({
  message,
  buttons,
  heading,
}: {
  message: string | React.ReactNode
  buttons: React.ReactNode
  heading: string
}) => {
  return (
    <div className="flex flex-col grow items-center justify-center min-h-[50vh] px-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">{heading}</h1>
      <div className="w-full max-w-md mx-auto">
        <Image
          src={notFound}
          alt="Not found illustration"
          priority
          loading="eager"
          width={500}
          height={400}
          className="w-full h-auto"
        />
      </div>

      <div className="mt-8 mb-10 text-lg text-secondary max-w-md mx-auto flex flex-col gap-4 items-center">
        {message}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">{buttons}</div>
    </div>
  )
}

export default PluginNotFound
