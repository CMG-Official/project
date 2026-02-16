import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
    const { id } = req.query

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id))
        return res.status(400).json({ error: "Invalid order id" })

    const { data, error } = await supabase
        .from("orders")
        .select(`
      id,
      service_type,
      cost,
      customer_id,
      customer_name,
      customer_avatar,
      created_at,
      status,
      cancellation_reason
    `)
        .eq("id", id)
        .single()

    if (error || !data)
        return res.status(404).json({ error: "Order not found" })

    res.status(200).json(data)
}
