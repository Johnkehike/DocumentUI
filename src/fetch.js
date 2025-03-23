// import { response } from "express";

let parentId = "";

function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
  
      return `${day}, ${month}, ${year}`;
    } catch (error) {
      return "Invalid date format";
    }
  }

  function bytesToMB(bytes) {
    if (typeof bytes !== 'number') {
      return NaN; // Return NaN if input is not a number
    }
  
    return bytes / (1024 * 1024);
  };

  function displayPdf(downloadUrl, containerDiv) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(downloadUrl)}#toolbar=0&scrollbar=0`;
    iframe.frameBorder = "0";
    iframe.scrolling = "auto";
    iframe.height = "100%";
    iframe.width = "100%";
    containerDiv.appendChild(iframe);
  }
  function nondisplayPdf(downloadUrl, containerDiv) {
    const embed = document.createElement("embed");
    embed.src = downloadUrl;
    embed.type = "application/pdf";
    embed.width = "100%";
    embed.height = "100%";
    containerDiv.appendChild(embed);
};
function displayImage(downloadUrl, containerDiv) {
  const img = document.createElement("img");
  img.src = downloadUrl;
  img.style.width = "100%";
  img.style.height = "100%";
  containerDiv.appendChild(img);
};

function displayOfficeDocument(downloadUrl, containerDiv) {
  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(downloadUrl)}`;
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  containerDiv.appendChild(iframe);
}

  async function getAdded() {
    
    try {
      const response = await fetch('/api/sharepoint/files');
      const files = await response.json();
      console.log(files);

      const fileList = document.getElementById("docs-cont");
      fileList.innerHTML = ""; // Clear previous list

      files.forEach(file => {
          // ✅ Only process items that are files (not folders)
          if (file.file) { 
              const dateString = file.lastModifiedDateTime;
              const formattedDate = formatDate(dateString);
              const bytes = file.size;
              const megabytes = Math.floor(bytesToMB(bytes));

              const newItem = document.createElement("div");
              newItem.classList.add("each-item");
              newItem.innerHTML = `
                  <div class="symbol"><i class="fa-solid fa-file"></i></div>
                  <div class="item-cont">
                      <h5>${file.name}</h5>
                      <p><a href="${file.webUrl}" target="_blank">${megabytes} MB</a> - ${formattedDate}</p>
                  </div>
              `;

              fileList.appendChild(newItem);
          }else{
            getFolders(files);
          }
      });
  } catch (error) {
      console.error("Error fetching files:", error);
  }
  }
  async function getSPO() {
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('/api/sharepoint/files');
            const files = await response.json();
            console.log(files);
            parentId = files[0].parentReference.id;
            console.log(parentId);
            
            

            const fileList = document.getElementById("docs-cont");
            fileList.innerHTML = ""; // Clear previous list

            files.forEach(file => {
                // ✅ Only process items that are files (not folders)
                if (file.file) { 
                    const dateString = file.lastModifiedDateTime;
                    const formattedDate = formatDate(dateString);
                    const bytes = file.size;
                    const megabytes = Math.floor(bytesToMB(bytes));
                    

                    const newItem = document.createElement("div");
                    newItem.classList.add("each-item");
                    newItem.innerHTML = `
                        <div class="symbol"><i class="fa-solid fa-file"></i></div>
                        <div class="item-cont">
                            <h5>${file.name}</h5>
                            <p><a href="${file.webUrl}" target="_blank">${megabytes} MB</a> - ${formattedDate}</p>
                        </div>
                    `;

                    newItem.addEventListener("click", (e) => {
                      e.preventDefault();
                      const mine = file.parentReference.driveId
                      console.log(file.name);
                      
                      displayRDocument( file.name );

                      // Find the currently selected item and reset its class
                      const selectedItem = document.querySelector(".each-item-selected");
                      if (selectedItem) {
                          selectedItem.classList.remove("each-item-selected");
                          selectedItem.classList.add("each-item");
                      }

                      // Update the clicked item
                      if (newItem.classList.contains("each-item")) {
                          newItem.classList.remove("each-item");
                          newItem.classList.add("each-item-selected");
                      }

                      
                  });



                    fileList.appendChild(newItem);
                }else{
                  getFolders(files);
                }
            });


        } catch (error) {
            console.error("Error fetching files:", error);
        }
    });
};

// Function to display the document
// async function displayDocument(fileUrl, fileName, itemId) {
  

//   try {
//     if (itemId) {
      
//       const response = await fetch(`/api/sharepoint/eachFolder?itemId=${encodeURIComponent(itemId)}&fileName=${encodeURIComponent(fileName)}`);
//       const files = await response.json();
      

      
      
      
//     }
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await files.json();
//   console.log("File data from server:", data); // Inspect data

//   if (data === null) {
//        console.log("Server returned null")
//   }
//   } catch (error) {
//     console.log(error);
    
//   }
 
  
// //   const viewDocContainer = document.getElementById("view-doc");
// //   viewDocContainer.innerHTML = ""; // Clear previous content




// //   try {
// //       // Determine file type and display appropriately
// //   if (fileUrl.toLowerCase().endsWith(".pdf")) {
// //     const embed = document.createElement("embed");
// //     embed.src = fileUrl;
// //     embed.type = "application/pdf";
// //     embed.width = "100%";
// //     embed.height = "600px";
// //     viewDocContainer.appendChild(embed);
// // } else if (fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg") || fileUrl.toLowerCase().endsWith(".png") || fileUrl.toLowerCase().endsWith(".gif")) {
// //     const img = document.createElement("img");
// //     img.src = fileUrl;
// //     img.style.maxWidth = "100%";
// //     viewDocContainer.appendChild(img);
// // } else if (fileUrl.toLowerCase().endsWith(".docx") || fileUrl.toLowerCase().endsWith(".docx") || fileUrl.toLowerCase().endsWith(".xls") || fileUrl.toLowerCase().endsWith(".xlsx") || fileUrl.toLowerCase().endsWith(".ppt") || fileUrl.toLowerCase().endsWith(".pptx")) {
// //     // Use Office Online for other documents
// //     const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
// //     const iframe = document.createElement("iframe");
// //     iframe.src = embedUrl;
// //     iframe.width = "100%";
// //     iframe.height = "600px";
// //     iframe.frameBorder = "0";
// //     viewDocContainer.appendChild(iframe);
// // } else {
// //   viewDocContainer.innerHTML = "<p>Document type not supported for inline viewing.</p>";

// // }
// //   } catch (error) {
// //     console.log(error);
    
// //   }
// };

async function displayDocument(fileUrl, fileName, itemId) {
  try {
      let data; // Declare data outside the if block

      if (itemId) {
          const response = await fetch(`/api/sharepoint/eachFolder?itemId=${encodeURIComponent(itemId)}&fileName=${encodeURIComponent(fileName)}`);

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          data = await response.json(); // Assign response data to data

      } else {
          // Handle the case where itemId is not provided (e.g., direct file URL)
          // You might need to implement a different logic here.
          console.log("itemId is not provided.");
          return; // Exit the function
      }

      console.log("File data from server:", data); // Inspect data

      if (data === null) {
          console.log("Server returned null");
      }

      // Process the data here (e.g., display the document)

      if (data && data['@microsoft.graph.downloadUrl']) {
        const downloadUrl = data['@microsoft.graph.downloadUrl'];
        const viewDocContainer = document.getElementById("view-doc");
        viewDocContainer.innerHTML = ""; // Clear previous content

        // Determine file type and display accordingly
        if (fileName.toLowerCase().endsWith(".pdf")) {
            displayPdf(downloadUrl, viewDocContainer);
        } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg") || fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".gif")) {
            displayImage(downloadUrl, viewDocContainer);
        } else if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".xls") || fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".csv")  || fileName.toLowerCase().endsWith(".ppt") || fileName.toLowerCase().endsWith(".ppt") || fileName.toLowerCase().endsWith(".pptx")) {
            displayOfficeDocument(downloadUrl, viewDocContainer);
        } else {
            viewDocContainer.innerHTML = "<p>Document type not supported for inline viewing.</p>";
        }

    } else {
        console.log("Download URL not found.");
    }


  } catch (error) {
      console.error("Error:", error);
  }
};

async function displayRDocument(fileName) {
  try {
      let data; // Declare data outside the if block

      if (fileName) {
          const response = await fetch(`/api/sharepoint/rootFolder?fileName=${encodeURIComponent(fileName)}`);

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          data = await response.json(); // Assign response data to data

      } else {
          // Handle the case where itemId is not provided (e.g., direct file URL)
          // You might need to implement a different logic here.
          console.log("itemId is not provided.");
          return; // Exit the function
      }

      console.log("File data from server:", data); // Inspect data

      if (data === null) {
          console.log("Server returned null");
      }

      // Process the data here (e.g., display the document)

      if (data && data['@microsoft.graph.downloadUrl']) {
        const downloadUrl = data['@microsoft.graph.downloadUrl'];
        const viewDocContainer = document.getElementById("view-doc");
        viewDocContainer.innerHTML = ""; // Clear previous content

        // Determine file type and display accordingly
        if (fileName.toLowerCase().endsWith(".pdf")) {
            displayPdf(downloadUrl, viewDocContainer);
        } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg") || fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".gif")) {
            displayImage(downloadUrl, viewDocContainer);
        } else if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".xls") || fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".csv")  || fileName.toLowerCase().endsWith(".ppt") || fileName.toLowerCase().endsWith(".ppt") || fileName.toLowerCase().endsWith(".pptx")) {
            displayOfficeDocument(downloadUrl, viewDocContainer);
        } else {
            viewDocContainer.innerHTML = "<p>Document type not supported for inline viewing.</p>";
        }

    } else {
        console.log("Download URL not found.");
    }


  } catch (error) {
      console.error("Error:", error);
  }
};

async function fetchFiles(itemId) {
  const fileList = document.getElementById("docs-cont");
  fileList.innerHTML = ""; 
  try {
      const response = await fetch(`/api/sharepoint/folders?itemId=${encodeURIComponent(itemId)}`);
      const files = await response.json();
      console.log(files);

      files.forEach(file => {
        // ✅ Only process items that are files (not folders)
        if (file.file) { 
            const dateString = file.lastModifiedDateTime;
            const formattedDate = formatDate(dateString);
            const bytes = file.size;
            const megabytes = Math.floor(bytesToMB(bytes));

            const newItem = document.createElement("div");
            newItem.classList.add("each-item");
            newItem.innerHTML = `
                <div class="symbol"><i class="fa-solid fa-file"></i></div>
                <div class="item-cont">
                    <h5>${file.name}</h5>
                    <p><a href="${file.webUrl}" target="_blank">${megabytes} MB</a> - ${formattedDate}</p>
                </div>
            `;
            newItem.addEventListener("click", () => {
              displayDocument(file.webUrl, file.name, itemId);

              const selectedItem = document.querySelector(".each-item-selected");
              if (selectedItem) {
                  selectedItem.classList.remove("each-item-selected");
                  selectedItem.classList.add("each-item");
              }

              // Update the clicked item
              if (newItem.classList.contains("each-item")) {
                  newItem.classList.remove("each-item");
                  newItem.classList.add("each-item-selected");
              }
          });

            fileList.appendChild(newItem);
        }
    });
  } catch (error) {
      console.error("Error fetching files:", error);
  }
};

function getFolders(folders){
  const folderList = document.getElementById("sidebar-main");
  folderList.innerHTML = ``;
  // const rootFolder = document.getElementById("root-doc");
  const rootFolder = document.createElement('div');
  rootFolder.classList.add('root-doc');
  rootFolder.setAttribute('id','root-doc');
  rootFolder.addEventListener('click', (e) => {
    e.preventDefault();
    getAdded();

  })
  rootFolder.innerHTML = `<i class="fa-solid fa-folder"></i> 
  <p>Documents</p>
  `;

  // rootFolder.textContent = 'Documents';
  folderList.append(rootFolder);
  folders.forEach(folder => {
    if (folder.folder) {
      const docItem = document.createElement('div');
      docItem.classList.add('doc');
      docItem.setAttribute('id','doc');
      docItem.innerHTML= `
          <i class="fa-solid fa-folder"></i>
          <p>${folder.name}</p>
      `;
      docItem.addEventListener('click', (e) => {
        e.preventDefault();
        const folderName = folder.id;
        fetchFiles(folderName);

        const selectedItem = document.querySelector(".root-doc");
        if (selectedItem) {
            selectedItem.classList.remove("root-doc");
            selectedItem.classList.add("doc");
        }

        // Update the clicked item
        if (docItem.classList.contains("doc")) {
            docItem.classList.remove("doc");
            docItem.classList.add("root-doc");
        }
      });
      folderList.append(docItem);
    }
  })
}

async function nonuploadFileToSharePoint(parentId, filename, file) {
  try {
      const reader = new FileReader();

      reader.onload = async () => {
          const base64FileContent = reader.result.split(',')[1]; // Extract base64 part

          const response = await fetch('/api/sharepoint/uploadFile', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  parentId,
                  filename,
                  fileContent: base64FileContent
              })
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("File upload response:", data);

          // Handle the response (e.g., show a success message)
      };

      reader.onerror = (error) => {
          console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file); // Read the file as base64
  } catch (error) {
      console.error("Error uploading file:", error);
  }
}

async function uploadFileToSharePoint(parentId, filename, file) {
  try {
      const reader = new FileReader();

      reader.onload = async () => {
          const base64FileContent = reader.result.split(',')[1];

          const url = `/api/sharepoint/uploadFile?parentId=${encodeURIComponent(parentId)}&filename=${encodeURIComponent(filename)}&fileContent=${encodeURIComponent(base64FileContent)}`;

          const response = await fetch(url, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json' 
              }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          

          // Handle the response
          getSPO();
      };

      reader.onerror = (error) => {
          console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
  } catch (error) {
      console.error("Error uploading file:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('upload-button');
  const fileInput = document.getElementById('file-input');

  uploadButton.addEventListener('click', () => {
      fileInput.click(); 
  });

  fileInput.addEventListener('change', (event) => {
    const myId = parentId;
    console.log(myId);
    
      const file = event.target.files[0];
      if (file) {
          uploadFileToSharePoint(myId, file.name, file); // Replace parentId
      }
  });
});

// const fileInput = document.getElementById('file-input'); // Replace with your file input element
// const parentId = "your-parent-folder-id"; // Replace with the parent folder ID

// fileInput.addEventListener('change', (event) => {
//   const file = event.target.files[0];
//   if (file) {
//       uploadFileToSharePoint(parentId, file.name, file);
//   }
// });

export { getSPO};