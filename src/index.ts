import * as dotenv from 'dotenv';
dotenv.config();

import {bot} from "./bot";
import TonConnect, {isWalletInfoRemote} from "@tonconnect/sdk";
import {storage} from "./storage";
import * as QRCode from 'qrcode';

const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';

bot.onText(/\/connect/, async msg => {
    const connector = new TonConnect({
        manifestUrl,
        storage
    });

    const walletsList = (await connector.getWallets()).filter(isWalletInfoRemote);

    const link = connector.connect(walletsList);

    const image = await QRCode.toBuffer(link);

    bot.sendPhoto(msg.chat.id, image);

    const unsubscribe = connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(msg.chat.id, `${wallet?.device.appName} connected`);
            clearTimeout(timeout);
        }

        unsubscribe();
    });

    const timeout = setTimeout(() => {
        unsubscribe();
        bot.sendMessage(msg.chat.id, 'Wallet was not connected');
    }, 1000 * 60 * 5)

});

bot.onText(/\/send_tx/, async msg => {

    // TODO keep connector SSE opened for a while
    const connector = new TonConnect({
        manifestUrl,
        storage
    });

    await connector.restoreConnection();

    if (!connector.connected) {
        bot.sendMessage(msg.chat.id, 'Wallet not connected');
        return;
    }

    await connector.sendTransaction({
        validUntil: Math.round(Date.now() / 1000) + 60 * 5,
        messages: [
            {
                address: 'UQCA6d29vC2UHcjWIzXt5fOr1W83PqqFZEc6C4K77QnwkcAj',
                amount: '10000000',
            }
        ]
    })

    bot.sendMessage(msg.chat.id, 'Tx successfully sent');

});

bot.onText(/\/disconnect/, msg => {
    // TODO
});

bot.onText(/\/my_wallet/, msg => {
    // TODO
});
