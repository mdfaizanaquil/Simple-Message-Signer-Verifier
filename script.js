const connectBtn = document.getElementById('connectBtn');
const signBtn = document.getElementById('signBtn');
const verifyBtn = document.getElementById('verifyBtn');
const signerDiv = document.getElementById('signer');
const messageToSignInput = document.getElementById('messageToSign');
const signatureOutput = document.getElementById('signatureOutput');
const messageToVerifyInput = document.getElementById('messageToVerify');
const signatureToVerifyInput = document.getElementById('signatureToVerify');
const addressToVerifyInput = document.getElementById('addressToVerify');
const verificationResult = document.getElementById('verificationResult');

let signer;
let provider;

async function connectWallet() {
    try {
        if (!window.ethereum) throw new Error("MetaMask is not installed!");
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        connectBtn.innerText = `Connected: ${address.slice(0, 6)}...`;
        connectBtn.disabled = true;
        signerDiv.classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
}

async function signMessage() {
    try {
        const message = messageToSignInput.value;
        if (!message) throw new Error("Message cannot be empty.");
        
        signatureOutput.innerText = "Please sign in MetaMask...";
        const signature = await signer.signMessage(message);
        signatureOutput.innerText = signature;

    } catch (error) {
        signatureOutput.innerText = `Error: ${error.message}`;
    }
}

async function verifySignature() {
    try {
        const message = messageToVerifyInput.value;
        const signature = signatureToVerifyInput.value;
        const address = addressToVerifyInput.value;

        if (!message || !signature || !address) {
            throw new Error("All verification fields are required.");
        }

        const recoveredAddress = ethers.utils.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            verificationResult.innerText = "✅ Signature is valid!";
            verificationResult.style.color = "#28a745";
        } else {
            verificationResult.innerText = "❌ Signature is NOT valid!";
            verificationResult.style.color = "#dc3545";
        }
    } catch (error) {
        verificationResult.innerText = `Error: ${error.message}`;
        verificationResult.style.color = "#ffc107";
    }
}

connectBtn.addEventListener('click', connectWallet);
signBtn.addEventListener('click', signMessage);
verifyBtn.addEventListener('click', verifySignature);
