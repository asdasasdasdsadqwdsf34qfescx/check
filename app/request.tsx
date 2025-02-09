const chekcIfModelIsOnline = async (modelUsername: string) => {
  try {
    const response = await fetch("/api/fetchModelStatus");
    const data = await response.json();
  
    const model = data.find(
      (item: any) => item.username.toLowerCase() === modelUsername.toLowerCase()
    );

    return model ? true : false;
  } catch (error) {
    console.error("Error checking model status:", error);
    return false;
  }
};

export default chekcIfModelIsOnline;


