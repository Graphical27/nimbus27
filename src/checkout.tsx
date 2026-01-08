export async function checkout() {
  try {
    const rest = await fetch("/api/checkout/vapor75", {
      method: "POST",
    });

    const data = await rest.json();
    window.location.href = data.url;
  } catch (err) {
    console.error("Checkout error:", err); 
  }
}
