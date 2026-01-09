import SimpleLoading from "@/components/loading/SimpleLoading"

export default function Loading() {
  // Use SimpleLoading for root-level loading.tsx because NextIntlClientProvider
  // is not available at this level (it's in [locale]/layout.tsx)
  // LoadingScreen with translations is used inside [locale] routes
  return <SimpleLoading />
}

