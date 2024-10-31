"use client"
import React from "react"

import PluginsAccordion from "./sidebarPlugins/SidebarPlugins"

// const NoGithubUser = () => {
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const { userError, fetchGithubUser } = useStore()

//   const handleSubmit = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined }) => {
//     event.preventDefault()
//     setIsSubmitting(true)

//     const formData = new FormData(event.target)
//     const githubUsername = formData.get("githubUsername")

//     await fetchGithubUser(githubUsername as string)
//     setIsSubmitting(false)
//   }

//   return (
//     <Form.Root className="w-[260px]" onSubmit={() => handleSubmit}>
//       <Form.Field className="mb-2.5 grid" name="githubUsername">
//         <div className="flex items-baseline justify-between">
//           <Form.Label className="color-primary text-[15px] font-medium leading-[35px]">Github Username</Form.Label>
//         </div>
//         <Form.Control asChild>
//           <input
//             className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
//             type="text"
//             required
//           />
//         </Form.Control>
//         <Form.Message className="error text-[13px] text-white opacity-80" match="valueMissing">
//           Please enter your GitHub username
//         </Form.Message>
//       </Form.Field>
//       <Form.Submit asChild>
//         <button
//           className="color-button shadow-blackA4focus:shadow-[0_0_0_2px] mt-2.5 box-border inline-flex h-[35px] w-full items-center justify-center rounded px-[15px] font-medium leading-none text-violet11 shadow-[0_2px_10px] focus:shadow-black focus:outline-none"
//           disabled={isSubmitting}
//           type="submit"
//         >
//           {isSubmitting ? (
//             <div className="flex items-center justify-center">
//               <LoadingIcon />
//             </div>
//           ) : (
//             "Confirm"
//           )}
//         </button>
//       </Form.Submit>
//       {userError && <div className="color-error mt-2.5 text-center text-sm font-bold opacity-80">{userError}!</div>}
//     </Form.Root>
//   )
// }

const SidebarContainer = () => {
  return (
    <div className='profile-data-container'>
      <div className='profile-data-flex'>
        {/* <div className="profile-data-avatar-container">
          <Image src={user?.avatar_url ?? logo} alt={user?.login ?? "Username"} fill className="profile-data-avatar" sizes="300px" />
        </div> */}
        {/* {user ? (
          <div className="profile-data-name">
            <h1>{user?.name}</h1>
            <h2>{user?.login}</h2>
          </div>
        ) : (
          <div className="profile-data-name">
            <NoGithubUser />
          </div>
        )} */}
        <PluginsAccordion />
      </div>
    </div>
  )
}

export default SidebarContainer
