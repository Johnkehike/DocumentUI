// import { response } from "express";
let trashItem = document.querySelector('.fa-trash');
const downloadItem = document.querySelector('.fa-download');


trashItem.addEventListener('click', (e) => {
    const fileDel = trashItem.dataset.filename;
    const fileFolder = trashItem.dataset.itemid;

    
    
    if (fileFolder !== "017CYZHKV6Y2GOVW7725BZO354PWSELRRZ") {
        delEachFolderFile(fileFolder, fileDel);
    } else {
        delFile(fileDel);
    }
    
    
});

downloadItem.addEventListener('click', (e) => {
    const fileDow = downloadItem.dataset.filename;
    const fileFolder = downloadItem.dataset.itemid;
    downloadFile(fileDow);

});

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
  };

  async function downloadFile(fileName) {
    try {
        const response = await fetch(`api/sharepoint/download?fileName=${encodeURIComponent(fileName)}`);
        const files = await response.json();
        console.log(files);
        

    } catch (error) {
        
    }
  }
  async function delEachFolderFile(itemId, fileName) {
    
    try {
        const url = `/api/sharepoint/folder/del?fileName=${encodeURIComponent(fileName)}&itemId=${encodeURIComponent(itemId)}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'content-Type': 'application/json'
            }
        });
        if (itemId) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } else {
            console.log('file not provided');
            return;
        }
    } catch (error) {
        console.error("Error fetching files:", error);
    }
    getSPO();
    document.querySelector('.view-doc').innerHTML = '';
  }
  async function delFile(fileName) {
    let data;
    const url = `/api/sharepoint/del?fileName=${encodeURIComponent(fileName)}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json' 
        }
    });

    if (fileName) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } else{
        console.log("file name not provided.");
        return; 
    }
    getSPO();
    document.querySelector('.view-doc').innerHTML = '';

  };

  //function for library root folder and first display of items
  async function getSPO() {
    // document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('/api/sharepoint/files');
            const files = await response.json();
            console.log(files);
            parentId = files[0].parentReference.id;
            console.log(parentId);

            const fileList = document.getElementById("docs-cont");
            const searchInput = document.getElementById("search-input");

            function displayFiles(filesToDisplay) {
                fileList.innerHTML = ""; // Clear previous list

                filesToDisplay.forEach(file => {
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
                            const mine = file.parentReference.driveId;
                            console.log(file.parentReference.id);

                            displayRDocument(file.name);
                            trashItem.setAttribute('data-filename', `${file.name}`);
                            trashItem.setAttribute('data-itemId', `${file.parentReference.id}`);
                            downloadItem.setAttribute('data-filename', `${file.name}`);
                            downloadItem.setAttribute('data-itemId', `${file.parentReference.id}`);
                            

                            const selectedItem = document.querySelector(".each-item-selected");
                            if (selectedItem) {
                                selectedItem.classList.remove("each-item-selected");
                                selectedItem.classList.add("each-item");
                            }

                            if (newItem.classList.contains("each-item")) {
                                newItem.classList.remove("each-item");
                                newItem.classList.add("each-item-selected");
                            }
                        });

                        fileList.appendChild(newItem);
                    } else {
                        getFolders(files);
                    }

                });
            }

            // Initial display
            displayFiles(files);

            // Search functionality
            searchInput.addEventListener("input", () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredFiles = files.filter(file => {
                    if (file.file) {
                        return file.name.toLowerCase().includes(searchTerm);
                    }
                    return false;
                });
                displayFiles(filteredFiles);
            });



        } catch (error) {
            console.error("Error fetching files:", error);
        }


        
    // });
};
  async function dongetSPO() {
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
              trashItem.setAttribute('data-filename', file.name);
              trashItem.setAttribute('data-itemId', file.parentReference.id);
              downloadItem.setAttribute('data-filename', `${file.name}`);
              downloadItem.setAttribute('data-itemId', `${file.parentReference.id}`);
              console.log(file.parentReference.id);
              

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
    getSPO();

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
};

//download file


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

export { getSPO};