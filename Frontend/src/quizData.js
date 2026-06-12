export const levelsData = {
  easy: [
    { question: "რა ჰქვია კომპიუტერის ტვინს, რომელიც ასრულებს ყველა ოპერაციას?", answers: ["GPU", "RAM", "CPU", "SSD"], correctAnswer: "CPU", timeToThink: 15, maxScore: 20 },
    { question: "რომელი კომპონენტი გამოიყენება დროებითი მონაცემების შესანახად?", answers: ["HDD", "RAM", "PSU", "BIOS"], correctAnswer: "RAM", timeToThink: 15, maxScore: 20 },
    { question: "რა ნიშნავს აბრევიატურა 'SSD'?", answers: ["Solid State Drive", "System Speed Drive", "Super Storage Device", "Simple Serial Data"], correctAnswer: "Solid State Drive", timeToThink: 15, maxScore: 20 },
    { question: "რა ფუნქცია აქვს კვების ბლოკს (PSU)?", answers: ["გრაფიკის დამუშავება", "მონაცემთა შენახვა", "დენის გარდაქმნა და მიწოდება", "ინტერნეტთან კავშირი"], correctAnswer: "დენის გარდაქმნა და მიწოდება", timeToThink: 15, maxScore: 20 },
    { question: "რა არის დედაპლატის (Motherboard) ძირითადი დანიშნულება?", answers: ["ვიდეოს ჩვენება", "ყველა კომპონენტის ერთმანეთთან დაკავშირება", "პროცესორის გაგრილება", "მხოლოდ ოპერაციული სისტემის ჩატვირთვა"], correctAnswer: "ყველა კომპონენტის ერთმანეთთან დაკავშირება", timeToThink: 15, maxScore: 20 },
    { question: "რომელი კომპონენტია პასუხისმგებელი გრაფიკული გამოსახულების დამუშავებაზე?", answers: ["CPU", "GPU", "NIC", "RAM"], correctAnswer: "GPU", timeToThink: 15, maxScore: 20 },
    { question: "რა არის კომპიუტერში 'ქულერის' (Cooler) ფუნქცია?", answers: ["მეხსიერების გაზრდა", "ტემპერატურის დარეგულირება", "ინტერნეტის სიჩქარის გაზრდა", "ხმის ხარისხის გაუმჯობესება"], correctAnswer: "ტემპერატურის დარეგულირება", timeToThink: 15, maxScore: 20 }
  ],
  normal: [
    { question: "რა არის 'BIOS/UEFI'?", answers: ["ოპერაციული სისტემა", "ტექნიკის მართვის ძირითადი პროგრამა", "ვირუსების საწინააღმდეგო პროგრამა", "მყარი დისკის ტიპი"], correctAnswer: "ტექნიკის მართვის ძირითადი პროგრამა", timeToThink: 15, maxScore: 20 },
    { question: "რას ნიშნავს 'Hz' (ჰერცი) მონიტორის შემთხვევაში?", answers: ["სიმკვეთრეს", "ფერთა რაოდენობას", "განახლების სიხშირეს", "ეკრანის ზომას"], correctAnswer: "განახლების სიხშირეს", timeToThink: 15, maxScore: 20 },
    { question: "რა არის 'Socket' პროცესორისთვის?", answers: ["გასაგრილებელი ნაწილი", "პროცესორის დასამაგრებელი ბუდე დედაპლატაზე", "მეხსიერების ტიპი", "კვების კაბელი"], correctAnswer: "პროცესორის დასამაგრებელი ბუდე დედაპლატაზე", timeToThink: 15, maxScore: 20 },
    { question: "რა არის 'Thermal Paste' (თერმოპასტა)?", answers: ["წებო დედაპლატისთვის", "გამტარი პასტა სითბოს უკეთ გადასაცემად", "პლასტმასის გამწმენდი", "მონიტორის დამცავი"], correctAnswer: "გამტარი პასტა სითბოს უკეთ გადასაცემად", timeToThink: 15, maxScore: 20 },
    { question: "რა არის კომპიუტერული 'Case'-ის ფუნქცია?", answers: ["მონაცემთა დამუშავება", "ყველა დეტალის დაცვა და კორპუსი", "ოპერაციული სისტემის ჩაწერა", "კლავიატურის მართვა"], correctAnswer: "ყველა დეტალის დაცვა და კორპუსი", timeToThink: 15, maxScore: 20 },
    { question: "რომელი ტერმინი აღნიშნავს ეკრანის გარჩევადობას?", answers: ["Hz", "Resolution (e.g. 1920x1080)", "RAM", "Core"], correctAnswer: "Resolution (e.g. 1920x1080)", timeToThink: 15, maxScore: 20 },
    { question: "რა არის 'SATA' კაბელი?", answers: ["მხოლოდ დენის კაბელი", "მონაცემთა გადაცემის კაბელი დისკებისთვის", "ინტერნეტ კაბელი", "ვიდეო კაბელი"], correctAnswer: "მონაცემთა გადაცემის კაბელი დისკებისთვის", timeToThink: 15, maxScore: 20 }
  ],
  hard: [
    { question: "რა არის 'XMP' პროფილი?", answers: ["RAM-ის სიჩქარის მატება", "ვიდეო ბარათის დრაივერი", "მყარი დისკის დაცვა", "ინტერნეტ კაბელის ტიპი"], correctAnswer: "RAM-ის სიჩქარის მატება", timeToThink: 15, maxScore: 20 },
    { question: "რომელია ყველაზე სწრაფი ტიპის შენახვის მოწყობილობა?", answers: ["HDD", "SSD SATA", "M.2 NVMe SSD", "USB Flash Drive"], correctAnswer: "M.2 NVMe SSD", timeToThink: 15, maxScore: 20 },
    { question: "რას ნიშნავს 'Overclocking'?", answers: ["კომპიუტერის გამორთვა", "კომპონენტის მუშაობის ნომინალურზე მაღალ სიჩქარეზე აწევა", "პროგრამების წაშლა", "ეკრანის გარჩევადობის შეცვლა"], correctAnswer: "კომპონენტის მუშაობის ნომინალურზე მაღალ სიჩქარეზე აწევა", timeToThink: 15, maxScore: 20 },
    { question: "რა არის 'PCIe' სლოტი?", answers: ["მხოლოდ RAM-ისთვის", "სწრაფი ინტერფეისი ვიდეო ბარათებისა და სხვა დაფებისთვის", "კვების ბლოკის შესაერთებელი", "მხოლოდ მაუსისთვის"], correctAnswer: "სწრაფი ინტერფეისი ვიდეო ბარათებისა და სხვა დაფებისთვის", timeToThink: 15, maxScore: 20 },
    { question: "რა არის 'Integrated Graphics'?", answers: ["ცალკე ვიდეო ბარათი", "პროცესორში ჩაშენებული ვიდეო ბირთვი", "მონიტორის დინამიკი", "დედაპლატის ბატარეა"], correctAnswer: "პროცესორში ჩაშენებული ვიდეო ბირთვი", timeToThink: 15, maxScore: 20 },
    { question: "რას ნიშნავს 'Latency' (CL) ოპერატიულ მეხსიერებაში?", answers: ["მეხსიერების მოცულობას", "სიგნალის დაყოვნების დროს", "ფერთა სიმკვეთრეს", "ინტერნეტის სიჩქარეს"], correctAnswer: "სიგნალის დაყოვნების დროს", timeToThink: 15, maxScore: 20 }
  ]
};  