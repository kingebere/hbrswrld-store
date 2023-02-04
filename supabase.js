import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getScreensById() {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("id", 1)
  return data
}

export async function sendImage(avatarFile) {
  console.log(avatarFile)
  const { data, error } = await supabase.storage
    .from("hbrs")
    .upload(avatarFile.name, avatarFile, {
      cacheControl: "3600",
      upsert: false,
    })
  console.log(data)
  return data
}

//get urls from public storage
export function getImage(company, image) {
  const { data } = supabase.storage.from(company).getPublicUrl(image)
  console.log(data)
  return data
}

//store customers details
export async function addCustomers(email, referenceId, images) {
  console.log(email, referenceId, images)
  const { data, error } = await supabase
    .from("Requested")
    .insert({
      email: email,
      referenceId: referenceId,
      paid: true,
      image: images,
    })
    .select()
  console.log(data)
  return data
}
