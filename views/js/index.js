let account;
let contract;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
    alert("MetaMask not found. Please install it.");
  }
});


// Connect MetaMask
document.getElementById("connectBtn").onclick = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  document.getElementById("connectBtn").innerText = "Connected: " + account.slice(0, 6) + "..." + account.slice(-4);
  document.getElementById("claimBtn").disabled = false;
};


// Claim Ticket (stubbed for now)
document.getElementById("claimBtn").onclick = async () => {
  try {
    const ticketTx = await contract.methods.mintTicket().send({ from: account });
    const ticketValue = ticketTx.events.TicketMinted.returnValues.id;
    const ticketString = `BLOCKPASS-${ticketValue}`;

    QRCode.toCanvas(document.getElementById('qrCanvas'), ticketString, function (error) {
      if (!error) {
        document.getElementById('qrContainer').style.display = 'block';
        generateTicketImage(ticketString);
        updatePagePadding();
      }
    });
  } catch (err) {
    alert("Ticket Minting Failed: " + err.message);
  }
};


function generateTicketImage(ticketId) {
  const canvas = document.getElementById("ticketCanvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  background.src = "ticket.png"; // your ticket background image

  background.onload = () => {
    // Draw background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = "#fff";
    ctx.font = "20px Segoe UI";
    ctx.fillText("BlockPass Entry Ticket", 20, 40);
    ctx.fillText("Ticket ID: " + ticketId, 20, 80);
    ctx.fillText("Wallet: " + account.slice(0, 10) + "...", 20, 110);
    ctx.fillText("Event: College Fest 2025", 20, 140);

    // Generate QR and draw on canvas
    QRCode.toDataURL(ticketId, { width: 100, margin: 1 }, function (err, url) {
      const qrImage = new Image();
      qrImage.src = url;
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 450, 60, 120, 120);
        document.getElementById("ticketPreview").style.display = "block";
      };
    });
  };
}

document.getElementById("claimBtn").onclick = async () => {
  const fakeTicketId = "BLOCKPASS-" + Math.floor(Math.random() * 1000000);
  
  QRCode.toCanvas(document.getElementById('qrCanvas'), fakeTicketId, function (error) {
    if (!error) {
      document.getElementById('qrContainer').style.display = 'block';
      generateTicketImage(fakeTicketId);
      updatePagePadding();  // <--- update padding here

    }
  });
};

document.getElementById("downloadBtn").onclick = () => {
  const link = document.createElement("a");
  link.download = "BlockPass_Ticket.png";
  link.href = document.getElementById("ticketCanvas").toDataURL("image/png");
  link.click();
};

function generateTicketImage(ticketId) {
  const canvas = document.getElementById("ticketCanvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  background.src = "views/pics/ticket.png"; // use your background image

  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // --- TEXT STYLING ---
    ctx.fillStyle = "#ffffff";

    // 🎟 Ticket Title
    ctx.font = "bold 26px 'Poppins'";
    ctx.fillText("🎟 BlockPass Entry Ticket", 20, 40);

    // Ticket ID
    ctx.font = "20px 'Poppins'";
    ctx.fillText("Ticket ID:", 20, 80);
    ctx.font = "bold 22px 'Courier New'";
    ctx.fillText(ticketId, 130, 80);

    // Wallet Address
    ctx.font = "20px 'Poppins'";
    ctx.fillText("Wallet:", 20, 120);
    ctx.font = "bold 20px 'Courier New'";
    ctx.fillText(account.slice(0, 10) + "...", 110, 120);

    // Event Name
    ctx.font = "20px 'Poppins'";
    ctx.fillText("Event:", 20, 160);
    ctx.font = "bold 21px 'Poppins'";
    ctx.fillText("College Fest 2025", 100, 160);

    // --- QR Code and Logo ---
    QRCode.toDataURL(ticketId, { width: 150, margin: 1 }, function (err, url) {
      const qrImage = new Image();
      qrImage.src = url;

      qrImage.onload = () => {
        // Draw larger QR
        ctx.drawImage(qrImage, 375, 60, 150, 150); // bigger size, aligned right

        // Optional Logo under QR
        const logo = new Image();
        logo.src = "views/pics/logo.png";
        logo.onload = () => {
          ctx.drawImage(logo, 30, 180, 100, 100); // logo position
          document.getElementById("ticketPreview").style.display = "block";
        };
      };
    });
  };
}

document.getElementById("downloadBtn").onclick = () => {
  const link = document.createElement("a");
  link.download = "BlockPass_Ticket.png";
  link.href = document.getElementById("ticketCanvas").toDataURL("image/png");
  link.click();
};
function updatePagePadding() {
  const qrVisible = document.getElementById('qrContainer').style.display !== 'none';
  const ticketVisible = document.getElementById('ticketPreview').style.display !== 'none';
  
  if (qrVisible || ticketVisible) {
    document.body.classList.add('has-popup');
    // or document.querySelector('.container').classList.add('has-popup');
  } else {
    document.body.classList.remove('has-popup');
    // or document.querySelector('.container').classList.remove('has-popup');
  }
}
