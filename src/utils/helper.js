
export function cleanLLMOutput(rawText) {
  if (!rawText) return "";

  return rawText
    .replace(/```json/g, "")   // remove ```json
    .replace(/```/g, "")       // remove ```
    .replace(/\n/g, " ")       // remove newlines (optional)
    .trim();
}


export const dummyOutput = {
  "name": "Saksham Jain",
  "email": "sakshamj92@gmail.com",
  "phone": "+91- 9899882332",
  "skills": [
      "C",
      "Python",
      "HTML",
      "CSS",
      "Javascript",
      "ReactJS",
      "Redux",
      "ImmutableJS",
      "Redux-Saga",
      "Webpack",
      "HTML-Canvas"
  ],
  "experience": [
      {
          "company": "IFlyLabs",
          "role": "Front-end Developer",
          "startDate": "June 2016",
          "endDate": "August 2017",
          "description": "Played a major role in a team of three for building the frontend (mobile-friendly, multi-lingual, multi-browser compatible) handling around 10 million requests per day, using ReactJs/Redux/Webpack."
      },
      {
          "company": "Waylo",
          "role": "Remote Front-end Developer",
          "startDate": "August 2017",
          "endDate": "March 2018",
          "description": "Built the frontend/website using React/Redux and consumed various Machine Learning APIs to suggest hotels to users."
      },
      {
          "company": "Roadzen",
          "role": "Senior Front-end Developer",
          "startDate": "March 2018",
          "endDate": null,
          "description": "Single-handedly working on building web apps for different insurance companies to process roadside assistance, pre-inspection, claims, etc."
      }
  ],
  "education": [
      {
          "institution": "Jaypee Institute of Information Technology, India",
          "degree": "B.Tech + M.Tech",
          "year": "2016"
      }
  ]
};
