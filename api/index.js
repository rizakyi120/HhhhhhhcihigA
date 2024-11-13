export default function handler(req, res) {
    const { id, txt, code } = req.query;

    // التحقق من أن `id` و `txt` و `code` قد تم تمريرهم في الرابط
    if (!id || !txt || !code) {
        return res.status(400).json({ error: "Both 'id', 'txt', and 'code' parameters are required" });
    }

    // تحقق من صحة `code`
    if (code !== 'FADAI7700ki') {
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
        let packet = `120000018d08${id}101220022a800308${id}10${id}22d201${txt}28f0ed8db7064a3d0a18efbca2efbcb2efbcb3e385a4efbcadefbcafefbcb2efbcaf10dedd8dae031893b6d3ad0320d7012883f9f7b103420c47524f564553545249544348520261726a520a4c68747470733a2f2f67726170682e66616365626f6f6b2e636f6d2f76392e302f3132303434333431303231333534352f706963747572653f77696474683d313630266865696768743d313630100118017200`;
        return packet;
    }

    // بناء الرسالة النهائية
    const packet = mes(id, txt);

    // إرجاع الحزمة كاستجابة نصية
    res.status(200).send(packet);
}
