
const axios = require('axios');

class BardAI {
  constructor(mainCookie) {
    this.cookie = mainCookie;
    if (!this.cookie) throw new Error("Session Cookies are missing, Unable to login to an account!");
  }

  async login() {
    try {
      const headerParams = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Cookie": `__Secure-1PSID=${this.cookie};`
      };

      const instance = axios.create({
        withCredentials: true,
        baseURL: "https://bard.google.com/",
        headers: headerParams
      });

      const response = await instance.get();
      this.sessionId = response.data.match(/SNlM0e":"(.*?)"/g)[0].substr(8).replace(/\"/g, '');
    } catch (error) {
      throw new Error('Unable to login to your account. Please try using new cookies and try again.');
    }
  }

  async startBard(message) {
    if (!this.sessionId) throw new Error('Please initialize login first to use bardai.');

    const postParamsStructure = [
      [message],
      null,
      [],
    ];

    const postData = {
      "f.req": JSON.stringify([null, JSON.stringify(postParamsStructure)]),
      at: this.sessionId
    };

    const headerParams = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": `__Secure-1PSID=${this.cookie};`
    };

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20230711.08_p0&_reqID=0&rt=c',
        headers: headerParams,
        withCredentials: true,
        data: postData
      });

      const bardAIRes = JSON.parse(response.data.split("\n")[3])[0][2];

      if (!bardAIRes) throw new Error(`Bard AI encountered an error ${response.data}.`);

      const bardData = JSON.parse(bardAIRes);
      const bardAI = JSON.parse(bardAIRes)[4][0];
      const result = bardAI[1][0];
      const images = bardAI[4]?.map(e => {
        return {
          url: e[3][0][0],
          tag: e[2],
          source: {
            name: e[1][1],
            original: e[0][0][0],
            website: e[1][0][0],
            favicon: e[1][3]
          }
        };
      });

      return this.imageFormat(result, images);
    } catch (error) {
      throw new Error(`Bard AI encountered an error ${error.message}.`);
    }
  }

  imageFormat(text, images) {
    if (!images) return { message: text, imageUrls: [] };

    let formattedText = text.replace(/\[Image of.*?\]/g, '').trim();

    images.forEach(imageData => {
      imageData.tag = imageData.tag.replace(/\[Image of.*?\]/g, "").trim();
    });

    return { message: formattedText, imageUrls: images.map((image) => image.url) };
  }
}

module.exports = BardAI;
