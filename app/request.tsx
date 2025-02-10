

const chekcIfModelIsOnline = async (modelUsername: string, data: any) => {
  try {
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


