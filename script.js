class RelieVRApp {
  constructor() {
    this.currentStep = 1
    this.totalSteps = 5
    this.patientData = {}
    this.preAssessmentData = {}
    this.postAssessmentData = {}
    this.sessionStartTime = null
    this.sessionTimer = null
    this.vrVideos = []
    this.currentVideoIndex = 0
    this.totalVideoDuration = 0
    this.vrProgressInterval = null

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.generateQuestionnaires()
    this.updateProgress()
  }

  setupEventListeners() {
    // Doctor form submission
    document.getElementById("doctorForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleDoctorFormSubmit()
    })

    // Pre-assessment submission
    document.getElementById("submitPreAssessment").addEventListener("click", () => {
      this.handlePreAssessmentSubmit()
    })

    document.getElementById("startVRSession").addEventListener("click", () => {
      this.startVRSession()
    })

    // Post-assessment submission
    document.getElementById("submitPostAssessment").addEventListener("click", () => {
      this.handlePostAssessmentSubmit()
    })

    document.getElementById("emergencyExit").addEventListener("click", () => {
      this.exitVRSession()
    })

    // Results actions
    document.getElementById("downloadReport").addEventListener("click", () => {
      this.downloadPDFReport()
    })

    document.getElementById("scheduleFollowup").addEventListener("click", () => {
      this.scheduleFollowup()
    })
  }

  handleDoctorFormSubmit() {
    const formData = new FormData(document.getElementById("doctorForm"))
    this.patientData = {
      doctorName: document.getElementById("doctorName").value,
      patientName: document.getElementById("patientName").value,
      patientAge: Number.parseInt(document.getElementById("patientAge").value),
      patientGender: document.getElementById("patientGender").value,
      operationType: document.getElementById("operationType").value,
      bloodPressure: document.getElementById("bloodPressure").value,
    }

    this.nextStep()
  }

  generateQuestionnaires() {
    this.generatePreAssessment()
    this.generatePostAssessment()
  }

  generatePreAssessment() {
    const container = document.getElementById("preQuestionnaire")
    const questions = [
      {
        id: "stress_emoji",
        type: "emoji",
        text: "How are you feeling right now? Select the emoji that best represents your current emotional state.",
        emojis: ["😢", "😟", "😐", "🙂", "😊"],
        labels: ["Very Sad", "Worried", "Neutral", "Good", "Very Happy"],
      },
      {
        id: "pain_level",
        type: "scale",
        text: "On a scale of 1-10, how would you rate your current pain level?",
        min: 1,
        max: 10,
      },
      {
        id: "anxiety_emoji",
        type: "emoji",
        text: "How anxious do you feel about your recovery?",
        emojis: ["😰", "😨", "😕", "😌", "😎"],
        labels: ["Very Anxious", "Anxious", "Somewhat Worried", "Calm", "Very Confident"],
      },
      {
        id: "sleep_quality",
        type: "scale",
        text: "How would you rate your sleep quality since the operation?",
        min: 1,
        max: 10,
      },
      {
        id: "mood_color",
        type: "color",
        text: "Which color best represents your current mood?",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"],
      },
      {
        id: "energy_level",
        type: "emoji",
        text: "How is your energy level today?",
        emojis: ["😴", "😪", "😐", "😊", "⚡"],
        labels: ["Very Tired", "Tired", "Neutral", "Energetic", "Very Energetic"],
      },
      {
        id: "appetite",
        type: "scale",
        text: "How is your appetite on a scale of 1-10?",
        min: 1,
        max: 10,
      },
      {
        id: "mobility",
        type: "scale",
        text: "How would you rate your current mobility/movement ability?",
        min: 1,
        max: 10,
      },
      {
        id: "social_comfort",
        type: "emoji",
        text: "How comfortable do you feel around others right now?",
        emojis: ["😰", "😟", "😐", "🙂", "😄"],
        labels: ["Very Uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very Comfortable"],
      },
      {
        id: "recovery_confidence",
        type: "scale",
        text: "How confident are you about your recovery process?",
        min: 1,
        max: 10,
      },
      {
        id: "stress_color",
        type: "color",
        text: "Which color represents your stress level?",
        colors: ["#FF4757", "#FF6348", "#FFA502", "#F1C40F", "#2ECC71", "#3742FA", "#5F27CD"],
      },
      {
        id: "concentration",
        type: "scale",
        text: "How is your ability to concentrate and focus?",
        min: 1,
        max: 10,
      },
      {
        id: "hope_emoji",
        type: "emoji",
        text: "How hopeful do you feel about the future?",
        emojis: ["😞", "😕", "😐", "🙂", "🌟"],
        labels: ["Not Hopeful", "Slightly Hopeful", "Neutral", "Hopeful", "Very Hopeful"],
      },
      {
        id: "physical_comfort",
        type: "scale",
        text: "How physically comfortable do you feel right now?",
        min: 1,
        max: 10,
      },
      {
        id: "emotional_support",
        type: "scale",
        text: "How supported do you feel by family and friends?",
        min: 1,
        max: 10,
      },
      {
        id: "recovery_speed",
        type: "emoji",
        text: "How do you feel about your recovery speed so far?",
        emojis: ["🐌", "😟", "😐", "👍", "🚀"],
        labels: ["Too Slow", "Slow", "Normal", "Good", "Excellent"],
      },
      {
        id: "medication_comfort",
        type: "scale",
        text: "How comfortable are you with your current medication routine?",
        min: 1,
        max: 10,
      },
      {
        id: "future_activities",
        type: "emoji",
        text: "How excited are you about returning to your normal activities?",
        emojis: ["😔", "😕", "😐", "😊", "🎉"],
        labels: ["Not Excited", "Slightly Excited", "Neutral", "Excited", "Very Excited"],
      },
      {
        id: "overall_wellbeing",
        type: "scale",
        text: "Overall, how would you rate your current wellbeing?",
        min: 1,
        max: 10,
      },
      {
        id: "additional_concerns",
        type: "text",
        text: "Is there anything else you would like to share about how you're feeling or any concerns you have?",
      },
    ]

    questions.forEach((question, index) => {
      const questionCard = this.createQuestionCard(question, index + 1)
      container.appendChild(questionCard)
    })
  }

  generatePostAssessment() {
    const container = document.getElementById("postQuestionnaire")
    const questions = [
      {
        id: "post_stress_emoji",
        type: "emoji",
        text: "After the VR therapy session, how are you feeling now?",
        emojis: ["😢", "😟", "😐", "🙂", "😊"],
        labels: ["Very Sad", "Worried", "Neutral", "Good", "Very Happy"],
      },
      {
        id: "post_pain_level",
        type: "scale",
        text: "How would you rate your pain level now after the VR session?",
        min: 1,
        max: 10,
      },
      {
        id: "post_anxiety_emoji",
        type: "emoji",
        text: "How anxious do you feel about your recovery now?",
        emojis: ["😰", "😨", "😕", "😌", "😎"],
        labels: ["Very Anxious", "Anxious", "Somewhat Worried", "Calm", "Very Confident"],
      },
      {
        id: "post_mood_color",
        type: "color",
        text: "Which color best represents your mood after the VR session?",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"],
      },
      {
        id: "vr_effectiveness",
        type: "scale",
        text: "How effective was the VR therapy session for you?",
        min: 1,
        max: 10,
      },
      {
        id: "post_energy_emoji",
        type: "emoji",
        text: "How is your energy level after the VR session?",
        emojis: ["😴", "😪", "😐", "😊", "⚡"],
        labels: ["Very Tired", "Tired", "Neutral", "Energetic", "Very Energetic"],
      },
      {
        id: "relaxation_level",
        type: "scale",
        text: "How relaxed do you feel after the VR experience?",
        min: 1,
        max: 10,
      },
      {
        id: "post_hope_emoji",
        type: "emoji",
        text: "How hopeful do you feel about your recovery now?",
        emojis: ["😞", "😕", "😐", "🙂", "🌟"],
        labels: ["Not Hopeful", "Slightly Hopeful", "Neutral", "Hopeful", "Very Hopeful"],
      },
      {
        id: "vr_enjoyment",
        type: "scale",
        text: "How much did you enjoy the VR experience?",
        min: 1,
        max: 10,
      },
      {
        id: "post_overall_wellbeing",
        type: "scale",
        text: "Overall, how would you rate your wellbeing after the VR session?",
        min: 1,
        max: 10,
      },
    ]

    questions.forEach((question, index) => {
      const questionCard = this.createQuestionCard(question, index + 1, "post")
      container.appendChild(questionCard)
    })
  }

  createQuestionCard(question, number, prefix = "pre") {
    const card = document.createElement("div")
    card.className = "question-card"

    let optionsHTML = ""

    switch (question.type) {
      case "emoji":
        optionsHTML = `
                    <div class="emoji-options">
                        ${question.emojis
                          .map(
                            (emoji, index) => `
                            <div class="emoji-option" data-value="${index + 1}" data-question="${prefix}_${question.id}" title="${question.labels[index]}">
                                ${emoji}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
        break

      case "scale":
        optionsHTML = `
                    <div class="scale-options">
                        ${Array.from(
                          { length: question.max - question.min + 1 },
                          (_, i) => `
                            <div class="scale-option" data-value="${question.min + i}" data-question="${prefix}_${question.id}">
                                ${question.min + i}
                            </div>
                        `,
                        ).join("")}
                    </div>
                `
        break

      case "color":
        optionsHTML = `
                    <div class="color-options">
                        ${question.colors
                          .map(
                            (color, index) => `
                            <div class="color-option" style="background-color: ${color}" data-value="${color}" data-question="${prefix}_${question.id}"></div>
                        `,
                          )
                          .join("")}
                    </div>
                `
        break

      case "text":
        optionsHTML = `
                    <textarea class="text-input" data-question="${prefix}_${question.id}" placeholder="Please share your thoughts..."></textarea>
                `
        break
    }

    card.innerHTML = `
            <div class="question-header">
                <div class="question-number">${number}</div>
                <div class="question-text">${question.text}</div>
            </div>
            ${optionsHTML}
        `

    // Add event listeners for options
    if (question.type !== "text") {
      const options = card.querySelectorAll("[data-question]")
      options.forEach((option) => {
        option.addEventListener("click", () => {
          // Remove selected class from siblings
          options.forEach((opt) => opt.classList.remove("selected"))
          // Add selected class to clicked option
          option.classList.add("selected")
        })
      })
    }

    return card
  }

  handlePreAssessmentSubmit() {
    this.preAssessmentData = this.collectAssessmentData("pre")
    this.generateVRRecommendation()
    this.nextStep()
  }

  handlePostAssessmentSubmit() {
    this.postAssessmentData = this.collectAssessmentData("post")
    this.generateResults()
    this.nextStep()
  }

  collectAssessmentData(prefix) {
    const data = {}
    const questions = document.querySelectorAll(`[data-question^="${prefix}_"]`)

    questions.forEach((question) => {
      const questionId = question.dataset.question

      if (question.classList.contains("selected")) {
        data[questionId] = question.dataset.value
      } else if (question.tagName === "TEXTAREA") {
        data[questionId] = question.value
      }
    })

    return data
  }

  generateVRRecommendation() {
    const container = document.getElementById("therapyRecommendation")
    const stressLevel = Number.parseInt(this.preAssessmentData.pre_stress_emoji) || 3
    const painLevel = Number.parseInt(this.preAssessmentData.pre_pain_level) || 5
    const anxietyLevel = Number.parseInt(this.preAssessmentData.pre_anxiety_emoji) || 3

    let recommendation = ""
    let video1Src = ""
    let video2Src = ""

    if (stressLevel <= 2 && anxietyLevel <= 2) {
      recommendation = `
                <h3><i class="fas fa-leaf"></i> Calming Nature Experience</h3>
                <p>Based on your high stress and anxiety levels, we recommend peaceful 360° nature experiences to help you relax and find inner calm.</p>
            `
      video1Src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      video2Src = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
    } else if (painLevel >= 7) {
      recommendation = `
                <h3><i class="fas fa-spa"></i> Pain Management Therapy</h3>
                <p>We've selected specialized 360° VR experiences designed to help manage pain through guided meditation and visualization techniques.</p>
            `
      video1Src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      video2Src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    } else {
      recommendation = `
                <h3><i class="fas fa-heart"></i> Positive Healing Journey</h3>
                <p>Your assessment shows you're on a good path. These uplifting 360° VR experiences will boost your mood and accelerate your healing process.</p>
            `
      video1Src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
      video2Src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    }

    container.innerHTML = recommendation

    this.vrVideos = [
      { src: video1Src, duration: 60 }, // 1 minute each for demo purposes
      { src: video2Src, duration: 60 },
    ]

    document.getElementById("vrVideo1").src = video1Src
    document.getElementById("vrVideo2").src = video2Src
  }

  startVRSession() {
    const modal = document.getElementById("vrModal")
    modal.classList.add("active")

    const requestFullscreen = () => {
      if (modal.requestFullscreen) {
        return modal.requestFullscreen()
      } else if (modal.webkitRequestFullscreen) {
        return modal.webkitRequestFullscreen()
      } else if (modal.msRequestFullscreen) {
        return modal.msRequestFullscreen()
      }
      return Promise.resolve()
    }

    requestFullscreen()
      .then(() => {
        console.log("[v0] Entered fullscreen mode successfully")
        this.sessionStartTime = Date.now()
        this.startSessionTimer()

        setTimeout(() => {
          this.currentVideoIndex = 0
          this.playVRVideoSequence()
        }, 100)
      })
      .catch((e) => {
        console.log("[v0] Fullscreen request failed, continuing without fullscreen:", e)
        this.sessionStartTime = Date.now()
        this.startSessionTimer()

        setTimeout(() => {
          this.currentVideoIndex = 0
          this.playVRVideoSequence()
        }, 100)
      })
  }

  playVRVideoSequence() {
    const video1 = document.getElementById("vrVideo1")
    const video2 = document.getElementById("vrVideo2")
    const currentVideoInfo = document.getElementById("currentVideoInfo")
    const progressText = document.getElementById("vrProgressText")

    console.log("[v0] Starting 360° VR video sequence")

    if (this.currentVideoIndex === 0) {
      currentVideoInfo.textContent = "Playing 360° Therapeutic Video 1 of 2"
      progressText.textContent = "Immersive 360° healing experience in progress..."

      video1.style.display = "block"
      video2.style.display = "none"

      video1.load()
      video1.muted = false // Ensure audio is enabled
      video1.volume = 0.7

      const playPromise = video1.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("[v0] First 360° video started playing successfully")
            this.updateVRProgress(0, this.vrVideos[0].duration)
          })
          .catch((e) => {
            console.log("[v0] First video autoplay failed:", e)
            video1.muted = true
            video1.play().catch(() => {
              setTimeout(() => {
                this.currentVideoIndex = 1
                this.playSecondVideo()
              }, 2000)
            })
          })
      }

      video1.onended = () => {
        console.log("[v0] First 360° video completed, transitioning to second video")
        this.currentVideoIndex = 1
        this.playSecondVideo()
      }

      setTimeout(() => {
        if (this.currentVideoIndex === 0) {
          console.log("[v0] Auto-advancing to second 360° video")
          this.currentVideoIndex = 1
          this.playSecondVideo()
        }
      }, this.vrVideos[0].duration * 1000)
    }
  }

  playSecondVideo() {
    const video1 = document.getElementById("vrVideo1")
    const video2 = document.getElementById("vrVideo2")
    const currentVideoInfo = document.getElementById("currentVideoInfo")
    const progressText = document.getElementById("vrProgressText")

    currentVideoInfo.textContent = "Playing 360° Therapeutic Video 2 of 2"
    progressText.textContent = "Final immersive 360° healing session..."

    video1.style.display = "none"
    video2.style.display = "block"

    video2.load()
    video2.muted = false
    video2.volume = 0.7

    const playPromise = video2.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("[v0] Second 360° video started playing successfully")
          this.updateVRProgress(this.vrVideos[0].duration, this.vrVideos[1].duration)
        })
        .catch((e) => {
          console.log("[v0] Second video autoplay failed:", e)
          video2.muted = true
          video2.play().catch(() => {
            setTimeout(() => {
              this.completeVRSession()
            }, 2000)
          })
        })
    }

    video2.onended = () => {
      console.log("[v0] Second 360° video completed, finishing VR session")
      setTimeout(() => {
        this.completeVRSession()
      }, 1000)
    }

    setTimeout(() => {
      if (this.currentVideoIndex === 1) {
        console.log("[v0] Auto-completing 360° VR session")
        this.completeVRSession()
      }
    }, this.vrVideos[1].duration * 1000)
  }

  updateVRProgress(startTime, duration) {
    const progressFill = document.getElementById("vrProgressFill")
    const totalDuration = this.vrVideos[0].duration + this.vrVideos[1].duration

    this.vrProgressInterval = setInterval(() => {
      const currentVideo =
        this.currentVideoIndex === 0 ? document.getElementById("vrVideo1") : document.getElementById("vrVideo2")

      if (currentVideo && !currentVideo.paused) {
        const elapsed = startTime + currentVideo.currentTime
        const progress = (elapsed / totalDuration) * 100
        progressFill.style.width = `${Math.min(progress, 100)}%`
      }
    }, 1000)
  }

  completeVRSession() {
    if (this.vrProgressInterval) {
      clearInterval(this.vrProgressInterval)
    }

    const progressText = document.getElementById("vrProgressText")
    progressText.textContent = "VR therapy session completed!"

    setTimeout(() => {
      this.exitVRSession()
      this.nextStep()
    }, 3000)
  }

  exitVRSession() {
    const modal = document.getElementById("vrModal")
    modal.classList.remove("active")

    document.getElementById("vrVideo1").pause()
    document.getElementById("vrVideo2").pause()

    if (this.vrProgressInterval) {
      clearInterval(this.vrProgressInterval)
    }

    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  startSessionTimer() {
    this.sessionTimer = setInterval(() => {
      if (this.sessionStartTime) {
        const elapsed = Date.now() - this.sessionStartTime
        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)
        const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

        document.getElementById("sessionTime").textContent = timeString
        document.getElementById("modalSessionTime").textContent = timeString
      }
    }, 1000)
  }

  generateResults() {
    const container = document.getElementById("resultsContainer")

    const stressImprovement = this.calculateImprovement("stress_emoji")
    const painImprovement = this.calculateImprovement("pain_level")
    const anxietyImprovement = this.calculateImprovement("anxiety_emoji")
    const wellbeingImprovement = this.calculateImprovement("overall_wellbeing")

    const sessionDuration = this.sessionStartTime ? Math.floor((Date.now() - this.sessionStartTime) / 60000) : 0

    container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-chart-line"></i>
                    <h3>Treatment Progress Summary</h3>
                </div>
                <p><strong>Patient:</strong> ${this.patientData.patientName}</p>
                <p><strong>Session Duration:</strong> ${sessionDuration} minutes</p>
                <p><strong>Treatment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-smile"></i>
                    <h3>Stress Level Improvement</h3>
                </div>
                <p>Improvement: ${stressImprovement}%</p>
                <div class="improvement-bar">
                    <div class="improvement-fill" style="width: ${Math.max(0, stressImprovement)}%"></div>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-heart"></i>
                    <h3>Pain Level Improvement</h3>
                </div>
                <p>Improvement: ${painImprovement}%</p>
                <div class="improvement-bar">
                    <div class="improvement-fill" style="width: ${Math.max(0, painImprovement)}%"></div>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-brain"></i>
                    <h3>Anxiety Level Improvement</h3>
                </div>
                <p>Improvement: ${anxietyImprovement}%</p>
                <div class="improvement-bar">
                    <div class="improvement-fill" style="width: ${Math.max(0, anxietyImprovement)}%"></div>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-star"></i>
                    <h3>Overall Wellbeing</h3>
                </div>
                <p>Improvement: ${wellbeingImprovement}%</p>
                <div class="improvement-bar">
                    <div class="improvement-fill" style="width: ${Math.max(0, wellbeingImprovement)}%"></div>
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-header">
                    <i class="result-icon fas fa-lightbulb"></i>
                    <h3>Recommendations</h3>
                </div>
                <ul>
                    <li>Continue VR therapy sessions 2-3 times per week</li>
                    <li>Practice deep breathing exercises daily</li>
                    <li>Maintain regular follow-up appointments</li>
                    <li>Consider additional relaxation techniques</li>
                </ul>
            </div>
        `
  }

  calculateImprovement(metric) {
    const preKey = `pre_${metric}`
    const postKey = `post_${metric}`

    const preValue = Number.parseInt(this.preAssessmentData[preKey]) || 0
    const postValue = Number.parseInt(this.postAssessmentData[postKey]) || 0

    if (preValue === 0 && postValue === 0) {
      return 0
    }

    if (preValue === 0) {
      if (metric.includes("pain") || metric.includes("anxiety") || metric.includes("stress")) {
        return postValue === 0 ? 100 : Math.max(0, 100 - postValue * 10)
      } else {
        return Math.min(100, postValue * 10)
      }
    }

    if (metric.includes("pain") || metric.includes("anxiety") || metric.includes("stress")) {
      const improvement = ((preValue - postValue) / preValue) * 100
      return Math.round(Math.max(0, Math.min(100, improvement)))
    } else {
      const improvement = ((postValue - preValue) / preValue) * 100
      return Math.round(Math.max(0, Math.min(100, improvement)))
    }
  }

  downloadPDFReport() {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setTextColor(79, 172, 254)
    doc.text("RelieVR - VR Therapy Report", 20, 30)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Patient Information", 20, 50)
    doc.setFontSize(12)
    doc.text(`Patient Name: ${this.patientData.patientName}`, 20, 65)
    doc.text(`Age: ${this.patientData.patientAge}`, 20, 75)
    doc.text(`Gender: ${this.patientData.patientGender}`, 20, 85)
    doc.text(`Operation Type: ${this.patientData.operationType}`, 20, 95)
    doc.text(`Doctor: ${this.patientData.doctorName}`, 20, 105)
    doc.text(`Blood Pressure: ${this.patientData.bloodPressure}`, 20, 115)

    doc.setFontSize(16)
    doc.text("VR Therapy Session", 20, 145)
    doc.setFontSize(12)
    const sessionDuration = this.sessionStartTime ? Math.floor((Date.now() - this.sessionStartTime) / 60000) : 0
    doc.text(`Session Date: ${new Date().toLocaleDateString()}`, 20, 160)
    doc.text(`Session Duration: ${sessionDuration} minutes`, 20, 170)

    doc.setFontSize(16)
    doc.text("Pre-Assessment Results", 20, 190)
    doc.setFontSize(12)
    let yPos = 205

    Object.entries(this.preAssessmentData).forEach(([key, value]) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      const cleanKey = key.replace("pre_", "").replace("_", " ").toUpperCase()
      doc.text(`${cleanKey}: ${value}`, 20, yPos)
      yPos += 10
    })

    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(16)
    doc.text("Post-Assessment Results", 20, yPos)
    yPos += 15
    doc.setFontSize(12)

    Object.entries(this.postAssessmentData).forEach(([key, value]) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      const cleanKey = key.replace("post_", "").replace("_", " ").toUpperCase()
      doc.text(`${cleanKey}: ${value}`, 20, yPos)
      yPos += 10
    })

    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(16)
    doc.text("Treatment Improvements", 20, yPos)
    yPos += 15
    doc.setFontSize(12)

    const stressImprovement = this.calculateImprovement("stress_emoji")
    const painImprovement = this.calculateImprovement("pain_level")
    const anxietyImprovement = this.calculateImprovement("anxiety_emoji")
    const wellbeingImprovement = this.calculateImprovement("overall_wellbeing")

    doc.text(`Stress Level Improvement: ${stressImprovement}%`, 20, yPos)
    doc.text(`Pain Level Improvement: ${painImprovement}%`, 20, yPos + 10)
    doc.text(`Anxiety Level Improvement: ${anxietyImprovement}%`, 20, yPos + 20)
    doc.text(`Overall Wellbeing Improvement: ${wellbeingImprovement}%`, 20, yPos + 30)

    const fileName = `relievr-report-${this.patientData.patientName}-${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)
  }

  nextStep() {
    document.querySelector(".step-section.active").classList.remove("active")

    this.currentStep++
    document.getElementById(`step${this.currentStep}`).classList.add("active")

    this.updateProgress()
  }

  updateProgress() {
    const progressFill = document.getElementById("progressFill")
    const progressText = document.getElementById("progressText")

    const percentage = (this.currentStep / this.totalSteps) * 100
    progressFill.style.width = `${percentage}%`
    progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new RelieVRApp()
})
