"use client"

import { useRef } from "react"
import axios, { AxiosError } from "axios"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Button } from "./Button"

export default function AddPost() {
  const [title, setTitle] = useState("")
  const [disabled, setDisabled] = useState(false)
  const queryClient = useQueryClient()
  const toastPostID = useRef("")

  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/post/addPost", { title }),
    {
      onError: (error: any) => {
        if (error instanceof AxiosError) {
          toast.remove(toastPostID.current)
          toast.error("Something went wrong")
          console.log("Error sending post:", error.response?.data)
        }
        setDisabled(false)
      },
      onSuccess: (data) => {
        toast.remove(toastPostID.current)
        toast.success("Post has been made! ")
        console.log("Post succesful: ", data.data)
        setDisabled(false)
        queryClient.invalidateQueries(["allPosts"]) //if we add new post, the old query is refetched
      }
    }
  )

  async function submitPost(e: React.FormEvent) {
    toastPostID.current = toast.loading("Creating your post...")
    e.preventDefault()
    setTitle("")
    setDisabled(true)
    mutate(title)
  }

  return (
    <form className="rounded-md bg-white" onSubmit={submitPost}>
      <div>
        <div className="p-5">
          <textarea
            maxLength={300}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md bg-gray-200 p-8 placeholder:text-black"
            name="title"
            value={title}
            placeholder="Add a post..."
            autoFocus
          />
          <div className="flex items-center justify-between">
            <p>{title.length}/300</p>
            <Button color="green" disabled={disabled} text="Submit" />
          </div>
        </div>
      </div>
    </form>
  )
}
