document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("userInput");
  const sendBtn = document.getElementById("send-btn");
  const luckyBtn = document.getElementById("lucky-btn");
  const chatBox = document.getElementById("chat");
  const initialChatMessage = chatBox.innerHTML; 

  let audioContext;
  let soundBuffer;
  const soundPath = 'assets/aww.mp3'; // تأكد أن هذا المسار صحيح

  function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        fetch(soundPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for sound file: ${soundPath}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                soundBuffer = decodedAudio;
            })
            .catch(error => {
                console.warn("Could not load or decode sound:", error.message, "Sound playback will be disabled.");
            });
    }
  }

  function playSound() {
    if (soundBuffer && audioContext) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const source = audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
  }

  let firstInput = true;

  function appendMessage(message, sender = "user") {
    if (firstInput && chatBox.innerHTML === initialChatMessage) {
        chatBox.innerHTML = ''; 
        firstInput = false;
    }

    const msgWrapper = document.createElement("div");
    msgWrapper.classList.add("message-wrapper", `message-${sender}`, "clear-both", "mb-3");

    const msgDiv = document.createElement("div");
    msgDiv.classList.add(
        "p-3", "rounded-lg", "max-w-[80%]", "md:max-w-[70%]", "inline-block", "text-slate-100", "leading-relaxed", "shadow-md"
    );
    
    msgDiv.innerText = message; 

    if (sender === "user") {
      msgDiv.classList.add("bg-sky-600", "ml-auto"); 
      msgWrapper.classList.add("text-right");
    } else if (sender === "bot") {
      msgDiv.classList.add("bg-teal-600", "mr-auto"); 
      msgWrapper.classList.add("text-left");
    } else { 
      msgDiv.classList.add("bg-slate-700", "text-slate-400", "text-center", "w-full", "max-w-full");
      msgDiv.classList.remove("inline-block");
      msgWrapper.classList.add("text-center");
    }
    
    msgWrapper.appendChild(msgDiv);
    chatBox.appendChild(msgWrapper);
    chatBox.scrollTop = chatBox.scrollHeight; 
  }

  function showLoadingIndicator() {
    if (firstInput && chatBox.innerHTML === initialChatMessage) {
        chatBox.innerHTML = ''; 
        firstInput = false;
    }
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-indicator";
    loadingDiv.classList.add("message-wrapper", "message-bot", "clear-both", "mb-3", "text-left");
    loadingDiv.innerHTML = `
        <div class="p-3 rounded-lg max-w-[80%] md:max-w-[70%] inline-block bg-teal-600 text-slate-100 leading-relaxed shadow-md">
            <div class="flex items-center space-x-2 space-x-reverse">
                <div class="w-2 h-2 bg-slate-200 rounded-full animate-pulse delay-75"></div>
                <div class="w-2 h-2 bg-slate-200 rounded-full animate-pulse delay-150"></div>
                <div class="w-2 h-2 bg-slate-200 rounded-full animate-pulse delay-300"></div>
                <span class="text-sm">عواش تكتب...</span>
            </div>
        </div>
    `;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  async function autoReply(userInput) {
    appendMessage(userInput, "user");
    showLoadingIndicator();

    // Updated System Prompt for a general, smart, and witty AI
    // تم تحديث الـ systemPrompt ليعكس الشخصية المطلوبة
    const systemPrompt = `أنتِ "عواش سيرش"، محرك بحث ودردشة فائق الذكاء. تتميزين بردودك الذكية، السريعة، والملهمة. أنتِ فتاة، لذا ردودك تحمل لمسة أنثوية حكيمة ومتزنة، وفي نفس الوقت يمكنك أن تكوني مرحة ومضحكة عند اللزوم.

أهم ما يميزك:
1.  **التكيف مع السؤال**: إذا كان السؤال بسيطًا ومباشرًا، تكون إجابتك مختصرة ودقيقة. أما إذا كان السؤال يتطلب شرحًا وتفصيلاً، فتُقدمين إجابة وافية وشاملة. طول الرد يجب أن يتناسب مع عمق السؤال.
2.  **خبيرة في العلاقات**: لديكِ فهم عميق للعلاقات الإنسانية والعاطفية (الصداقة، الحب، العلاقات الأسرية، إلخ). تقدمين نصائح ورؤى قيمة بأسلوب متعاطف، حكيم، وداعم، مع مراعاة خصوصية المستخدم وعدم إطلاق أحكام.
3.  **شخصية متوازنة**: تجمعين بين الحكمة والجدية في المواقف التي تتطلب ذلك، وبين الفكاهة والمرح لإضفاء جو من البهجة. يمكنك استخدام الدعابة الذكية والتعليقات الطريفة بشكل مناسب.
4.  **الهدف**: هدفك هو إبهار المستخدمين بمعلومات دقيقة وشروحات واضحة، وتقديم المساعدة بأسلوب فريد وجذاب. تفهمين الأسئلة بعمق، حتى المعقدة منها أو غير الواضحة، وتجيبين عليها بطريقة مبتكرة وشاملة.

اجعلي كل تفاعل تجربة ممتعة ومفيدة للمستخدم. أنت هنا لتكوني الأفضل والأكثر إفادةً و"شطارة"! استخدمي لغة عربية فصحى وواضحة، مع الحفاظ على روحك الأنثوية الذكية والمرحة. تجنبي تكرار العبارات الافتتاحية أو الختامية بشكل مبالغ فيه. كوني طبيعية في حوارك.`;

    if (typeof GEMINI_API_KEY === 'undefined' || !GEMINI_API_KEY) {
        console.error("Gemini API Key is not defined. Please check config.js");
        removeLoadingIndicator();
        appendMessage("عذراً، يبدو أن هناك مشكلة في إعدادات الاتصال. (مفتاح API غير موجود)", "system-error");
        return;
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n المستخدم يسأل: " + userInput }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 350, // تم زيادة الحد الأقصى للسماح بردود أطول عند الحاجة
        temperature: 0.8,    // تعديل طفيف للحفاظ على الإبداع مع التركيز
      },
      safetySettings: [ 
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      removeLoadingIndicator();

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error with Gemini API:", response.status, errorData);
        let errorMessage = `عذراً، واجهتني مشكلة في معالجة طلبك (خطأ ${response.status}).`;
        if (errorData && errorData.error && errorData.error.message) {
            errorMessage += ` التفاصيل: ${errorData.error.message}`;
        }
        appendMessage(errorMessage, "system-error");
        return;
      }

      const data = await response.json();
      
      let reply = "لم أستطع توليد رد. حاول مرة أخرى."; 
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        reply = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        reply = `تم حظر الرد بسبب: ${data.promptFeedback.blockReason}. يرجى تعديل سؤالك.`;
         if (data.promptFeedback.safetyRatings) {
            data.promptFeedback.safetyRatings.forEach(rating => {
                if(rating.blocked) reply += ` (${rating.category})`;
            });
        }
      }
      
      appendMessage(reply, "bot");
      playSound(); 

      if (window.navigator.vibrate) {
        window.navigator.vibrate(100); 
      }

    } catch (err) {
      removeLoadingIndicator();
      console.error("Network or other error with Gemini API:", err);
      appendMessage("أوه! يبدو أن هناك خطأ في الاتصال بالشبكة أو مشكلة أخرى. تحقق من اتصالك وحاول مرة أخرى.", "system-error");
    }
  }

  sendBtn.addEventListener("click", () => {
    initAudio(); 
    const input = inputField.value.trim();
    if (input) {
      inputField.value = ""; 
      autoReply(input);
    }
  });

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      initAudio(); 
      e.preventDefault(); 
      sendBtn.click();
    }
  });

  luckyBtn.addEventListener("click", () => {
    initAudio(); 
    const luckyQueries = [
        "ما هو أغرب سؤال تم طرحه عليك اليوم؟",
        "أخبريني نكتة ذكية!",
        "ما هو لون السماء على كوكب المريخ؟",
        "اقترح عليّ كتاباً ممتعاً.",
        "ما هي أحدث الاكتشافات في مجال الذكاء الاصطناعي؟",
        "كيف أتعامل مع صديق متقلب المزاج؟",
        "ما هي أفضل طريقة لبدء محادثة مع شخص لا أعرفه جيداً؟"
    ];
    const randomQuery = luckyQueries[Math.floor(Math.random() * luckyQueries.length)];
    inputField.value = randomQuery; 
    autoReply(randomQuery);
  });

});
