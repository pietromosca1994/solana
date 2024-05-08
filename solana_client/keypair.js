const web3 = require("@solana/web3.js");
const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.QUICKNODE_KEY;

async function main() {
    let keypair = web3.Keypair.generate();
    console.log(`Public Key: ${keypair.publicKey.toBase58()}\nPrivate Key: ${keypair.secretKey}`)

    // const connection = new web3.Connection("https://api.devnet.solana.com", "finalized");
    const rpc_url=`https://polished-smart-slug.solana-devnet.quiknode.pro/${process.env.QUICKNODE_KEY}`;
    let connection = new web3.Connection(rpc_url, "confirmed")

    try{
      const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        1 * web3.LAMPORTS_PER_SOL
      );

      console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);
    } catch (error) {
      console.error(error);
    }

    // fs.writeFile('wallet.json', JSON.stringify(new Uint8Array(keypair.secretKey)), (err) => {
    //     if (err) {
    //       console.error('Error writing JSON file:', err);
    //       return;
    //     }
    //     console.log('JSON file has been saved.');
    //   });
}

main();