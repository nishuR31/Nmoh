export default function redisKeyGen(app, service, id, purpose) {
  const parts = [app || "scafe", service];

  if (id?.length) parts.push(id);
  if (purpose?.length) parts.push(purpose);
  // console.log(parts)

  return parts.join(":");
}
