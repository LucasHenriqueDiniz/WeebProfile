"use client"
import React, { Suspense } from "react"

import useStore from "app/store"
import RenderActivePlugins from "web-client/app/RenderActivePlugins"

import NoPluginsSelected from "./NoPluginsSelected"

import LoadingIcon from "../LoadingIcon"

const PreviewTab = () => {
  const { activePlugins } = useStore()

  return (
    <>
      {activePlugins.length === 0 ? (
        <NoPluginsSelected />
      ) : (
        <Suspense fallback={<LoadingIcon />}>
          <RenderActivePlugins />
        </Suspense>
      )}
    </>
  )
}

export default PreviewTab
