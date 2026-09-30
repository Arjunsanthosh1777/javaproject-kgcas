# 🧮 Advanced Scientific Calculator

A modern, responsive, browser-based **Advanced Scientific Calculator** built using **HTML5, CSS3, and Vanilla JavaScript**.

The project is designed as an individual academic project for the **BSc Information Technology** programme and demonstrates practical implementation of mathematical operations, scientific functions, expression parsing, DOM manipulation, keyboard interaction, local storage, and responsive web design.

---

## 👨‍💻 Student

| Details           | Information                    |
| ----------------- | ------------------------------ |
| **Name**          | Arjun Santhosh                 |
| **Roll Number**   | 25BIT008                       |
| **Programme**     | BSc Information Technology     |
| **Year**          | Second Year                    |
| **Academic Year** | 2026                           |
| **Project**       | Advanced Scientific Calculator |

---

## 🚀 Project Overview

The Advanced Scientific Calculator is a web application that provides both basic and scientific mathematical calculations through a clean and responsive interface.

Unlike a simple calculator that performs only basic arithmetic, this project supports scientific operations, mathematical constants, trigonometric calculations, memory functions, calculation history, keyboard input, and persistent browser storage.

The application runs completely in the browser and does not require a backend server or external database.

---

## ✨ Features

### 🔢 Basic Calculations

* Addition `+`
* Subtraction `−`
* Multiplication `×`
* Division `÷`
* Percentage `%`
* Decimal calculations
* Positive/negative toggle `±`
* Parentheses `( )`
* Factorial `!`

### 🔬 Scientific Functions

* Sine `sin`
* Cosine `cos`
* Tangent `tan`
* Inverse sine `sin⁻¹`
* Inverse cosine `cos⁻¹`
* Inverse tangent `tan⁻¹`
* Natural logarithm `ln`
* Common logarithm `log`
* Square root `√`
* Cube root `∛`
* Square `x²`
* Power `xʸ`
* Reciprocal `1/x`
* Absolute value `|x|`

### 📐 Angle Modes

Supports:

* **DEG — Degree Mode**
* **RAD — Radian Mode**

Example:

```text
sin(90°) = 1

sin(π/2) = 1
```

---

### 🧠 Memory Functions

The calculator includes:

* `MC` — Memory Clear
* `MR` — Memory Recall
* `M+` — Memory Add
* `M−` — Memory Subtract

---

### 🔄 Previous Answer

The `Ans` function allows the previous calculation result to be reused.

Example:

```text
25 + 25 = 50

Ans × 2 = 100
```

---

### 📜 Calculation History

The application stores previous calculations and displays them in a dedicated history panel.

Example:

```text
25 + 25
= 50

√144
= 12

5!
= 120
```

History can also be cleared when required.

---

### ⌨️ Keyboard Support

The calculator supports keyboard input for faster calculations.

Supported keys include:

```text
0–9
+
-
*
/
%
(
)
!
.
Enter
Backspace
Escape
```

---

### 🌙 Light & Dark Mode

The interface includes a light/dark theme switch.

The selected theme is saved using browser `localStorage`.

---

### 💾 Local Storage

The application uses browser LocalStorage to preserve:

* Calculator history
* Previous answer
* Memory value
* Angle mode
* Theme preference

The data remains available after refreshing the browser.

---

### 📱 Responsive Design

The calculator is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The interface automatically adapts to different screen sizes.

---

## 🧠 Expression Processing

One of the main technical components of this project is the custom mathematical expression processor.

Instead of relying on JavaScript's `eval()` function, the calculator processes expressions using a structured evaluation system.

### Processing Pipeline

```text
User Input
     ↓
Tokenization
     ↓
Normalization
     ↓
Implicit Multiplication
     ↓
Shunting Yard Algorithm
     ↓
Reverse Polish Notation (RPN)
     ↓
Stack Evaluation
     ↓
Final Result
```

### Example

For:

```text
2 + 3 × 4
```

The calculator respects mathematical operator precedence:

```text
3 × 4 = 12

2 + 12 = 14
```

Final result:

```text
14
```

---

## 🛡️ Error Handling

The calculator validates mathematical expressions and handles invalid operations.

Examples:

```text
5 ÷ 0
→ Error
```

```text
√(-4)
→ Error
```

```text
log(-5)
→ Error
```

```text
(5 + 3
→ Error
```

Invalid factorial operations are also rejected.

---

## 🛠️ Technologies Used

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| **HTML5**            | Structure and interface         |
| **CSS3**             | Styling and responsive design   |
| **JavaScript**       | Calculator logic                |
| **DOM API**          | User interaction and dynamic UI |
| **LocalStorage**     | Persistent browser data         |
| **Git**              | Version control                 |
| **GitHub**           | Source code hosting             |
| **Netlify / Vercel** | Deployment                      |

---

## 📁 Project Structure

```text
Advanced-Scientific-Calculator/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── screenshots/
    ├── calculator.png
    ├── dark-mode.png
    └── history.png
```

---

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd Advanced-Scientific-Calculator
```

### 3. Run the application

Open:

```text
index.html
```

in any modern web browser.

No installation or backend server is required.

---

## 🌐 Deployment

The project can be deployed using:

* Netlify
* Vercel
* GitHub Pages

After deployment, the calculator can be accessed through a public URL.

### Live Demo

🔗 **Live Project:** `YOUR_LIVE_PROJECT_URL`

### GitHub Repository

🔗 **Repository:** `YOUR_GITHUB_REPOSITORY_URL`

---

## 🧪 Sample Test Cases

| Test             | Input      | Expected Output |
| ---------------- | ---------- | --------------: |
| Addition         | `10 + 20`  |            `30` |
| Subtraction      | `30 − 10`  |            `20` |
| Multiplication   | `5 × 6`    |            `30` |
| Division         | `50 ÷ 5`   |            `10` |
| Square Root      | `√25`      |             `5` |
| Cube Root        | `∛27`      |             `3` |
| Power            | `2³`       |             `8` |
| Factorial        | `5!`       |           `120` |
| Sine             | `sin(90°)` |             `1` |
| Cosine           | `cos(0°)`  |             `1` |
| Natural Log      | `ln(e)`    |             `1` |
| Logarithm        | `log(100)` |             `2` |
| Division by Zero | `5 ÷ 0`    |           Error |

---

## 🎯 Project Objectives

The main objectives of this project are:

* Develop a functional scientific calculator using web technologies.
* Implement mathematical expressions with operator precedence.
* Implement scientific mathematical functions.
* Support DEG and RAD modes.
* Implement calculator memory functions.
* Maintain calculation history.
* Support keyboard interaction.
* Store user preferences using LocalStorage.
* Create a responsive and accessible interface.
* Practice JavaScript algorithms and DOM manipulation.
* Deploy a complete web application online.

---

## 📚 Learning Outcomes

Through this project, the following concepts were practically implemented:

* HTML structure
* CSS layouts
* CSS responsive design
* JavaScript fundamentals
* DOM manipulation
* Event handling
* Mathematical programming
* Expression parsing
* Stack-based algorithms
* Shunting Yard algorithm
* Reverse Polish Notation
* LocalStorage
* Error handling
* Git and GitHub
* Web deployment

---

## 🔮 Future Enhancements

Possible future improvements include:

* 📊 Graph plotting
* 🧮 Equation solver
* 📈 Statistics calculator
* 🔢 Matrix calculations
* 🔄 Unit conversion
* 📱 Progressive Web App (PWA)
* 📤 Export calculation history
* ☁️ Cloud synchronization
* 🧠 Advanced mathematical expression support

---

## 👨‍🎓 Academic Project

This project was developed as an individual academic project for:

**BSc Information Technology — Second Year**

**Academic Year: 2026**

---

## 📄 License

This project is developed for educational and academic purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

### Built with ❤️ using HTML, CSS & JavaScript

**Arjun Santhosh | BSc Information Technology | 2026**
