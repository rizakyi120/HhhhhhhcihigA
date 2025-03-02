export default function handler(req, res) {
    const { id, txt, code } = req.query;

    // التحقق من أن `id` و `txt` و `code` قد تم تمريرهم في الرابط
    if (!id || !txt || !code) {
        return res.status(400).json({ error: "Both 'id', 'txt', and 'code' parameters are required" });
    }

    // تحقق من صحة `code`
    if (code !== 'FOXC4') {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    // Function to ensure the text is exactly 420 characters
    function max(text) {
        // إذا كان طول النص أكبر من 420، نختصره إلى 420 حرفًا
        if (text.length > 420) {
            text = text.substring(0, 420);
        }

        // إذا كان طول النص أقل من 420، نضيف "00" حتى يصل إلى 420 حرفًا
        if (text.length < 420) {
            let fillLength = 420 - text.length;
            text += "00".repeat(Math.ceil(fillLength / 2)).substring(0, fillLength);
        }

        return text;
    }

    // Function to generate the packet
    function mes(id, text) {
        let msg = Buffer.from(text, 'utf-8').toString('hex'); // تحويل النص إلى hex
        let txt = max(msg);
        let packet = `12000004a708${id}101220022a9b0908${id}10${id}22f40${txt}28a083cabd064a250a0b4f5554e385a4414c56494e10e7b290ae0320d20128c1b7f8b103420737526164616121520261726a640a5e68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f612f414367386f634a614d4363556f6c4355397148576c6c2d79506e76516d3354782d304630304d30596a633350437737326f7a44503d7339362d63100118017200`;
        return packet;
    }

    // بناء الرسالة النهائية
    const packet = mes(id, txt);

    // إرجاع الحزمة كاستجابة نصية
    res.status(200).send(packet);
}
