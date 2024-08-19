export const shareOnX = (content: string, url: string) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    content
  )}&url=${encodeURIComponent(url)}`;
  window.open(twitterShareUrl, "_blank");
};

export const copyToClipboard = (content: string) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      alert("Link copied to clipboard"); //TODO replace with modal
    })
    .catch((err) => {
      console.error("Failed to copy the text to clipboard: ", err);
    });
};
