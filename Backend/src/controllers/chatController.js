export async function getStreamToken(req, res) {
  try {
    // TODO: implement Stream token generation when Stream is configured
    res.status(200).json({
      message: "Stream not configured yet",
      userId: req.user.supabase_id,
      userName: req.user.name,
      userImage: req.user.profile_image,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
