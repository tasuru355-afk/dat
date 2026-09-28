import { Question } from '../types/question';

export const PRESET_QUESTIONS: Question[] = [
  // ==========================================
  // 1. CHỦ ĐỀ: TIN HỌC (10 CÂU)
  // ==========================================
  {
    id: 'it-1',
    question: 'Trong kiến trúc máy tính, CPU là viết tắt của cụm từ nào?',
    options: [
      'Central Processing Unit',
      'Computer Personal Unit',
      'Control Program Utility',
      'Core Process Universal'
    ],
    correctIndex: 0,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'CPU là viết tắt của Central Processing Unit (Bộ xử lý trung tâm), đảm nhận xử lý mọi phép toán và điều khiển hoạt động của máy tính.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-2',
    question: 'Đơn vị lưu trữ 1 Gigabyte (GB) tương đương với bao nhiêu Megabyte (MB) theo chuẩn nhị phân?',
    options: ['100 MB', '1000 MB', '1024 MB', '2048 MB'],
    correctIndex: 2,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'Theo chuẩn nhị phân trong khoa học máy tính, 1 GB = 1024 MB (2¹⁰ MB).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-3',
    question: 'Giao thức bảo mật mã hóa phổ biến trên các trang web có biểu tượng ổ khóa an toàn là gì?',
    options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'],
    correctIndex: 2,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'HTTPS (HyperText Transfer Protocol Secure) sử dụng chứng chỉ SSL/TLS để mã hóa dữ liệu truyền tải giữa người dùng và máy chủ.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-4',
    question: 'Ngôn ngữ lập trình nào sau đây chạy trực tiếp trên trình duyệt web để tạo tính năng tương tác cho người dùng?',
    options: ['C++', 'Python', 'JavaScript', 'Pascal'],
    correctIndex: 2,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'JavaScript là ngôn ngữ lập trình kịch bản chạy gốc trên tất cả các trình duyệt web hiện đại để xử lý logic tương tác.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-5',
    question: 'Phím tắt phổ biến nào trong hệ điều hành Windows dùng để dán (Paste) nội dung vừa sao chép?',
    options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'],
    correctIndex: 1,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'Ctrl + C là sao chép (Copy), Ctrl + V là dán (Paste), Ctrl + X là cắt (Cut), Ctrl + Z là hoàn tác (Undo).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-6',
    question: 'Bộ nhớ RAM trong máy tính có đặc điểm quan trọng nào sau đây?',
    options: [
      'Lưu trữ vĩnh viễn dữ liệu ngay cả khi mất điện',
      'Mất toàn bộ dữ liệu khi tắt nguồn điện máy tính (Bộ nhớ khả biến)',
      'Tốc độ chậm hơn đĩa cứng truyền thống HDD',
      'Chỉ dùng để cài đặt hệ điều hành Windows'
    ],
    correctIndex: 1,
    category: 'Tin học',
    difficulty: 'medium',
    explanation: 'RAM (Random Access Memory) là bộ nhớ truy xuất ngẫu nhiên khả biến (Volatile), dữ liệu tạm thời sẽ mất khi máy tính bị mất điện hoặc tắt máy.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-7',
    question: 'Tên miền trang web có đuôi mở rộng ".edu" thường được sử dụng cho tổ chức nào?',
    options: ['Tổ chức thương mại', 'Tổ chức giáo dục và đào tạo', 'Cơ quan chính phủ', 'Tổ chức phi lợi nhuận'],
    correctIndex: 1,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'Đuôi tên miền ".edu" (Education) được cấp riêng cho các tổ chức giáo dục, trường học và viện nghiên cứu.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-8',
    question: 'Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Last In, First Out - Vào sau ra trước)?',
    options: ['Queue (Hàng đợi)', 'Stack (Ngăn xếp)', 'Array (Mảng)', 'Linked List (Danh sách liên kết)'],
    correctIndex: 1,
    category: 'Tin học',
    difficulty: 'medium',
    explanation: 'Stack (Ngăn xếp) hoạt động theo nguyên tắc LIFO (phần tử thêm vào sau cùng sẽ được lấy ra đầu tiên), ví dụ như ngăn xếp đĩa ăn.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-9',
    question: 'Hệ điều hành mã nguồn mở nhân Linux phổ biến nhất dành cho các thiết bị di động thông minh hiện nay là gì?',
    options: ['iOS', 'Windows Phone', 'Android', 'Symbian'],
    correctIndex: 2,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'Android được Google phát triển dựa trên nền tảng nhân mã nguồn mở Linux, là hệ điều hành di động phổ biến nhất thế giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'it-10',
    question: 'Định dạng tệp tin hình ảnh nào sau đây hỗ trợ ảnh động ngắn và nền trong suốt?',
    options: ['JPEG', 'GIF', 'MP3', 'TXT'],
    correctIndex: 1,
    category: 'Tin học',
    difficulty: 'easy',
    explanation: 'GIF (Graphics Interchange Format) là định dạng ảnh bitmap hỗ trợ hiển thị chuỗi khung hình động ngắn và màu nền trong suốt.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 2. CHỦ ĐỀ: TOÁN HỌC (10 CÂU)
  // ==========================================
  {
    id: 'math-1',
    question: 'Số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất là số nào?',
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Số nguyên tố nhỏ nhất là 2, có đúng hai ước là 1 và chính nó. Số 2 cũng là số nguyên tố chẵn duy nhất.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-2',
    question: 'Giá trị của biểu thức 2³ + 3² bằng bao nhiêu?',
    options: ['12', '17', '15', '24'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Ta có 2³ = 8 và 3² = 9. Do đó 8 + 9 = 17.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-3',
    question: 'Định lý nào khẳng định: "Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông"?',
    options: ['Định lý Talet', 'Định lý Pythagoras', 'Định lý Pascal', 'Định lý Fermat'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Định lý Pythagoras (Pi-ta-go): a² + b² = c² với tam giác vuông có hai cạnh góc vuông a, b và cạnh huyền c.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-4',
    question: 'Một hình tròn có bán kính r = 5cm. Diện tích hình tròn đó xấp xỉ bằng bao nhiêu? (Lấy π ≈ 3.14)',
    options: ['31.4 cm²', '78.5 cm²', '15.7 cm²', '25 cm²'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'medium',
    explanation: 'Diện tích hình tròn S = π × r² = 3.14 × 5² = 3.14 × 25 = 78.5 cm².',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-5',
    question: 'Tổng ba góc trong một tam giác phẳng luôn bằng bao nhiêu độ?',
    options: ['90°', '180°', '270°', '360°'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Trong hình học Euclid phẳng, tổng ba góc trong bất kỳ tam giác nào luôn bằng 180°.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-6',
    question: 'Phương trình bậc nhất 3x - 12 = 0 có nghiệm x bằng bao nhiêu?',
    options: ['x = 3', 'x = 4', 'x = -4', 'x = 36'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: '3x - 12 = 0 ⇔ 3x = 12 ⇔ x = 12 / 3 = 4.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-7',
    question: 'Số nào sau đây chia hết cho cả 2, 3 và 5?',
    options: ['125', '180', '215', '248'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'medium',
    explanation: 'Số chia hết cho 2 và 5 phải có tận cùng là 0 (loại 125, 215, 248). Số 180 có tổng các chữ số 1 + 8 + 0 = 9 chia hết cho 3 nên chia hết cho cả 2, 3 và 5.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-8',
    question: 'Căn bậc hai số học của 144 (kí hiệu √144) bằng bao nhiêu?',
    options: ['11', '12', '14', '72'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Vì 12 > 0 và 12² = 144 nên √144 = 12.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-9',
    question: 'Nếu gieo một con xúc xắc cân đối đồng chất 6 mặt, xác suất để nhận được mặt có số chấm là số chẵn bằng bao nhiêu?',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correctIndex: 2,
    category: 'Toán học',
    difficulty: 'medium',
    explanation: 'Các mặt chẵn gồm {2, 4, 6} (3 mặt) trên tổng số 6 mặt khả dĩ. Xác suất P = 3/6 = 1/2.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'math-10',
    question: 'Chu vi của một hình chữ nhật có chiều dài 8cm và chiều rộng 5cm là bao nhiêu?',
    options: ['13 cm', '26 cm', '40 cm', '21 cm'],
    correctIndex: 1,
    category: 'Toán học',
    difficulty: 'easy',
    explanation: 'Chu vi hình chữ nhật C = (dài + rộng) × 2 = (8 + 5) × 2 = 13 × 2 = 26 cm.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 3. CHỦ ĐỀ: TIẾNG ANH (10 CÂU)
  // ==========================================
  {
    id: 'eng-1',
    question: 'Choose the correct word: "She _______ to school by bicycle every morning."',
    options: ['goes', 'go', 'going', 'gone'],
    correctIndex: 0,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: 'Chủ ngữ ngôi thứ 3 số ít "She" ở thì hiện tại đơn kết hợp với động từ thêm -es: "goes".',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-2',
    question: 'What is the opposite of the adjective "brave"?',
    options: ['Courageous', 'Cowardly', 'Strong', 'Honest'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: '"Brave" nghĩa là dũng cảm, từ trái nghĩa là "cowardly" (hèn nhát, nhát gan).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-3',
    question: 'Past tense (dạng quá khứ) của động từ bất quy tắc "write" là gì?',
    options: ['writed', 'wrote', 'written', 'writing'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: 'Động từ bất quy tắc: write (nguyên mẫu) - wrote (quá khứ đơn V2) - written (quá khứ phân từ V3).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-4',
    question: 'Choose the suitable preposition: "We usually have lunch _______ 12:00 PM."',
    options: ['in', 'at', 'on', 'for'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: 'Giới từ đi với mốc thời gian cụ thể (giờ giấc) là "at" (ví dụ: at 12:00 PM, at 7 o\'clock).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-5',
    question: 'Which word means "a person who designs buildings"?',
    options: ['Author', 'Architect', 'Astronaut', 'Mechanic'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'medium',
    explanation: '"Architect" là kiến trúc sư (người thiết kế bản vẽ các tòa nhà, công trình).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-6',
    question: 'Complete the sentence: "If it rains tomorrow, we _______ at home."',
    options: ['will stay', 'stayed', 'staying', 'would stay'],
    correctIndex: 0,
    category: 'Tiếng Anh',
    difficulty: 'medium',
    explanation: 'Câu điều kiện loại 1 (Conditional Type 1): Mệnh đề If dùng hiện tại đơn (rains), mệnh đề chính dùng "will + V nguyên mẫu" (will stay).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-7',
    question: 'What is the plural form of the noun "child"?',
    options: ['childs', 'children', 'childrens', 'childes'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: 'Danh từ số nhiều bất quy tắc của "child" (một đứa trẻ) là "children" (những đứa trẻ).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-8',
    question: 'Select the synonym (từ đồng nghĩa) of "enormous":',
    options: ['Tiny', 'Huge', 'Narrow', 'Weak'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'medium',
    explanation: '"Enormous" nghĩa là to lớn, khổng lồ; đồng nghĩa với từ "Huge".',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-9',
    question: 'Choose the correct form: "English is _______ all over the world."',
    options: ['speak', 'spoke', 'spoken', 'speaking'],
    correctIndex: 2,
    category: 'Tiếng Anh',
    difficulty: 'medium',
    explanation: 'Thể bị động (Passive Voice) ở hiện tại đơn: S + is/am/are + V3/V-ed. Do đó đáp án là "spoken" (speak - spoke - spoken).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'eng-10',
    question: 'Which of the following is an adverb (trạng từ)?',
    options: ['Quick', 'Quickly', 'Quicker', 'Quickness'],
    correctIndex: 1,
    category: 'Tiếng Anh',
    difficulty: 'easy',
    explanation: 'Hậu tố "-ly" thường cấu tạo trạng từ chỉ cách thức từ tính từ: Quick (tính từ) -> Quickly (trạng từ: một cách nhanh chóng).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 4. CHỦ ĐỀ: LỊCH SỬ (10 CÂU)
  // ==========================================
  {
    id: 'his-1',
    question: 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
    options: ['1945', '1954', '1975', '1968'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Chiến dịch lịch sử Điện Biên Phủ kết thúc toàn thắng vào ngày 7 tháng 5 năm 1954.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-2',
    question: 'Vị vua nào đã ban "Chiếu dời đô" từ Hoa Lư về Thăng Long vào mùa thu năm 1010?',
    options: ['Lý Thái Tổ', 'Lý Thường Kiệt', 'Trần Hưng Đạo', 'Lê Lợi'],
    correctIndex: 0,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Năm 1010, vua Lý Thái Tổ (Lý Công Uẩn) quyết định dời đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-3',
    question: 'Ba lần kháng chiến chống quân xâm lược Mông - Nguyên diễn ra dưới triều đại phong kiến nào của Việt Nam?',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Hậu Lê', 'Nhà Nguyễn'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'medium',
    explanation: 'Dưới sự lãnh đạo của triều đại nhà Trần và Hưng Đạo Đại Vương Trần Quốc Tuấn, quân dân Đại Việt đã 3 lần đại phá quân Mông - Nguyên (1258, 1285, 1288).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-4',
    question: 'Bản "Tuyên ngôn Độc lập" khai sinh ra nước Việt Nam Dân chủ Cộng hòa được Chủ tịch Hồ Chí Minh đọc vào ngày nào?',
    options: ['19/8/1945', '2/9/1945', '30/4/1975', '1/5/1954'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập lịch sử.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-5',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn kéo dài 10 năm giành lại độc lập và lập ra triều đại Hậu Lê?',
    options: ['Ngô Quyền', 'Lê Lợi', 'Đinh Bộ Lĩnh', 'Quang Trung'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Lê Lợi cùng các nghĩa sĩ dựng cờ khởi nghĩa Lam Sơn (1418 - 1427), đánh đuổi quân Minh và lên ngôi vua (Lê Thái Tổ).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-6',
    question: 'Chiến thắng vang dội trên sông Bạch Đằng năm 938 của Ngô Quyền đã đánh tan đội quân xâm lược nào?',
    options: ['Quân Nam Hán', 'Quân Tống', 'Quân Minh', 'Quân Thanh'],
    correctIndex: 0,
    category: 'Lịch sử',
    difficulty: 'medium',
    explanation: 'Năm 938, Ngô Quyền dùng kế cắm cọc ngầm trên sông Bạch Đằng đánh tan quân Nam Hán, chấm dứt hơn 1000 năm Bắc thuộc.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-7',
    question: 'Vị anh hùng áo vải cờ đào nào đã chỉ huy cuộc hành quân thần tốc đánh tan 29 vạn quân Mãn Thanh vào dịp Tết Kỷ Dậu 1789?',
    options: ['Trần Hưng Đạo', 'Quang Trung - Nguyễn Huệ', 'Lý Thường Kiệt', 'Phan Bội Châu'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Hoàng đế Quang Trung (Nguyễn Huệ) lãnh đạo đại quân Tây Sơn tiến công thần tốc giải phóng Thăng Long vào mùng 5 Tết Kỷ Dậu 1789.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-8',
    question: 'Trận chiến "Điện Biên Phủ trên không" oanh liệt bảo vệ thủ đô Hà Nội diễn ra vào năm nào?',
    options: ['1954', '1968', '1972', '1975'],
    correctIndex: 2,
    category: 'Lịch sử',
    difficulty: 'medium',
    explanation: 'Tháng 12 năm 1972, quân và dân miền Bắc đã kiên cường đánh bại chiến dịch tập kích bằng máy bay B-52 của không quân Mỹ trong 12 ngày đêm.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-9',
    question: 'Chiến dịch Hồ Chí Minh lịch sử giải phóng hoàn toàn miền Nam, thống nhất đất nước toàn thắng vào ngày nào?',
    options: ['30 tháng 4 năm 1975', '1 tháng 5 năm 1975', '26 tháng 3 năm 1975', '2 tháng 9 năm 1975'],
    correctIndex: 0,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Trưa ngày 30 tháng 4 năm 1975, xe tăng quân giải phóng húc đổ cổng Dinh Độc Lập, kết thúc thắng lợi cuộc kháng chiến chống Mỹ cứu nước.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'his-10',
    question: 'Bài thơ thần "Nam quốc sơn hà" khẳng định chủ quyền dân tộc gắn liền với tên tuổi của vị danh tướng nào thời Lý?',
    options: ['Trần Quốc Tuấn', 'Lý Thường Kiệt', 'Yết Kiêu', 'Phạm Ngũ Lão'],
    correctIndex: 1,
    category: 'Lịch sử',
    difficulty: 'easy',
    explanation: 'Bài thơ "Nam quốc sơn hà" (Sông núi nước Nam) vang lên bên phòng tuyến sông Như Nguyệt gắn với danh tướng Lý Thường Kiệt trong cuộc kháng chiến chống Tống.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 5. CHỦ ĐỀ: ĐỊA LÝ (10 CÂU)
  // ==========================================
  {
    id: 'geo-1',
    question: 'Đỉnh núi nào được mệnh danh là "Nóc nhà Đông Dương" với độ cao 3.143m?',
    options: ['Bạch Mộc Lương Tử', 'Fansipan (Phan Xi Păng)', 'Pu Si Lung', 'Tây Côn Lĩnh'],
    correctIndex: 1,
    category: 'Địa lý',
    difficulty: 'easy',
    explanation: 'Fansipan (thuộc dãy Hoàng Liên Sơn, tỉnh Lào Cai) có độ cao 3.143m, là đỉnh núi cao nhất 3 nước Đông Dương.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-2',
    question: 'Dòng sông dài nhất thế giới chảy qua lãnh thổ Việt Nam là dòng sông nào?',
    options: ['Sông Hồng', 'Sông Đà', 'Sông Đồng Nai', 'Sông Mê Kông'],
    correctIndex: 3,
    category: 'Địa lý',
    difficulty: 'medium',
    explanation: 'Sông Mê Kông bắt nguồn từ Tây Tạng, chảy qua 6 quốc gia và khi đổ vào Việt Nam được gọi là sông Cửu Long với 9 cửa sông đổ ra biển.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-3',
    question: 'Đường bờ biển của Việt Nam trải dài khoảng bao nhiêu km từ Móng Cái đến Hà Tiên?',
    options: ['2.360 km', '3.260 km', '4.150 km', '1.650 km'],
    correctIndex: 1,
    category: 'Địa lý',
    difficulty: 'medium',
    explanation: 'Đường bờ biển của nước ta dài khoảng 3.260 km, mang lại tiềm năng to lớn về kinh tế biển và du lịch.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-4',
    question: 'Đại dương nào có diện tích và độ sâu trung bình lớn nhất trên Trái Đất?',
    options: ['Đại Tây Dương', 'Ấn Độ Dương', 'Thái Bình Dương', 'Bắc Băng Dương'],
    correctIndex: 2,
    category: 'Địa lý',
    difficulty: 'easy',
    explanation: 'Thái Bình Dương là đại dương lớn nhất và sâu nhất hành tinh, chiếm hơn một phần ba bề mặt Trái Đất.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-5',
    question: 'Quần đảo Hoàng Sa và Trường Sa thuộc chủ quyền thiêng liêng của Việt Nam nằm ở vùng biển nào?',
    options: ['Biển Đông', 'Biển Hoa Đông', 'Biển Nhật Bản', 'Vịnh Bengal'],
    correctIndex: 0,
    category: 'Địa lý',
    difficulty: 'easy',
    explanation: 'Hai quần đảo Hoàng Sa và Trường Sa nằm trên Biển Đông, thuộc chủ quyền lãnh thổ không thể tách rời của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-6',
    question: 'Hồ nước ngọt tự nhiên lớn nhất ở Việt Nam được hình thành từ vùng núi đá vôi là hồ nào?',
    options: ['Hồ Hoàn Kiếm', 'Hồ Tây', 'Hồ Ba Bể', 'Hồ Thác Bà'],
    correctIndex: 2,
    category: 'Địa lý',
    difficulty: 'medium',
    explanation: 'Hồ Ba Bể (tỉnh Bắc Kạn) là hồ nước ngọt tự nhiên trên núi lớn nhất Việt Nam và nằm trong top 20 hồ nước ngọt tự nhiên đặc biệt của thế giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-7',
    question: 'Vịnh biển nào của Việt Nam hai lần được UNESCO công nhận là Di sản thiên nhiên thế giới về cảnh quan và địa chất?',
    options: ['Vịnh Nha Trang', 'Vịnh Hạ Long', 'Vịnh Cam Ranh', 'Vịnh Lăng Cô'],
    correctIndex: 1,
    category: 'Địa lý',
    difficulty: 'easy',
    explanation: 'Vịnh Hạ Long (tỉnh Quảng Ninh) được UNESCO công nhận Di sản Thiên nhiên Thế giới nhờ cảnh quan hàng ngàn hòn đảo đá vôi kỳ vĩ.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-8',
    question: 'Quốc gia nào có diện tích lãnh thổ đất liền lớn nhất thế giới hiện nay?',
    options: ['Canada', 'Hoa Kỳ', 'Nga (Liên bang Nga)', 'Trung Quốc'],
    correctIndex: 2,
    category: 'Địa lý',
    difficulty: 'easy',
    explanation: 'Nga có diện tích hơn 17 triệu km², trải dài trên cả hai châu lục Á và Âu, là quốc gia có diện tích lớn nhất thế giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-9',
    question: 'Kinh tuyến gốc (0 độ) đi qua đài thiên văn hoàng gia Greenwich thuộc thành phố nào?',
    options: ['Paris', 'Luân Đôn (London)', 'New York', 'Tokyo'],
    correctIndex: 1,
    category: 'Địa lý',
    difficulty: 'medium',
    explanation: 'Kinh tuyến gốc 0° đi qua Đài thiên văn Hoàng gia Greenwich ở thủ đô Luân Đôn, Vương quốc Anh.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'geo-10',
    question: 'Tỉnh nào ở Việt Nam có diện tích tự nhiên rộng lớn nhất cả nước?',
    options: ['Thanh Hóa', 'Nghệ An', 'Gia Lai', 'Sơn La'],
    correctIndex: 1,
    category: 'Địa lý',
    difficulty: 'medium',
    explanation: 'Nghệ An là tỉnh có diện tích lớn nhất Việt Nam với gần 16.500 km².',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 6. CHỦ ĐỀ: KHOA HỌC (10 CÂU)
  // ==========================================
  {
    id: 'sci-1',
    question: 'Chất khí nào chiếm tỉ lệ thể tích lớn nhất trong bầu khí quyển Trái Đất (khoảng 78%)?',
    options: ['Oxy (Oxygen)', 'Khí Nitơ (Nitrogen)', 'Khí Cacbonic (CO₂)', 'Khí Heli'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Khí Nitơ (N₂) chiếm khoảng 78% thể tích khí quyển, trong khi Oxy chiếm khoảng 21%.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-2',
    question: 'Hành tinh nào trong Hệ Mặt Trời được mệnh danh là "Hành tinh Đỏ"?',
    options: ['Sao Kim (Venus)', 'Sao Hỏa (Mars)', 'Sao Mộc (Jupiter)', 'Sao Thủy (Mercury)'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Sao Hỏa có màu đỏ cam đặc trưng do bề mặt chứa hàm lượng oxit sắt (gỉ sét) dồi dào.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-3',
    question: 'Hiện tượng quang hợp ở thực vật chủ yếu diễn ra tại bào quan nào trong tế bào lá cây?',
    options: ['Nhân tế bào', 'Ti thể', 'Lục lạp (Chloroplast)', 'Không bào'],
    correctIndex: 2,
    category: 'Khoa học',
    difficulty: 'medium',
    explanation: 'Lục lạp chứa chất diệp lục giúp hấp thụ năng lượng ánh sáng mặt trời để chuyển hóa nước và CO₂ thành glucose và oxy.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-4',
    question: 'Công thức hóa học quen thuộc của nước nguyên chất là gì?',
    options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Mỗi phân tử nước gồm 2 nguyên tử hydro liên kết với 1 nguyên tử oxy, kí hiệu hóa học là H₂O.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-5',
    question: 'Ở áp suất khí quyển tiêu chuẩn (1 atm), nước tinh khiết sôi và chuyển thành thể khí ở nhiệt độ bao nhiêu?',
    options: ['50°C', '80°C', '100°C', '120°C'],
    correctIndex: 2,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Nhiệt độ sôi tiêu chuẩn của nước tinh khiết ở áp suất 1 atm là 100°C (và đóng băng ở 0°C).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-6',
    question: 'Loài động vật nào sau đây là động vật có vú (thú) lớn nhất còn sinh sống trên Trái Đất?',
    options: ['Voi châu Phi', 'Cá voi xanh', 'Cá mập trắng', 'Hươu cao cổ'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Cá voi xanh có thể dài tới hơn 30 mét và nặng gần 200 tấn, là loài động vật lớn nhất từng được biết đến trong lịch sử sinh giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-7',
    question: 'Âm thanh không thể truyền qua được môi trường nào sau đây?',
    options: ['Chất rắn (Kim loại)', 'Chất lỏng (Nước)', 'Chất khí (Không khí)', 'Chân không'],
    correctIndex: 3,
    category: 'Khoa học',
    difficulty: 'medium',
    explanation: 'Sóng âm là sóng cơ học, cần các phần tử vật chất dao động để lan truyền. Do đó âm thanh không truyền được trong môi trường chân không.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-8',
    question: 'Kim loại nào sau đây ở thể lỏng trong điều kiện nhiệt độ phòng thông thường (25°C)?',
    options: ['Sắt (Fe)', 'Nhôm (Al)', 'Thủy ngân (Hg)', 'Đồng (Cu)'],
    correctIndex: 2,
    category: 'Khoa học',
    difficulty: 'medium',
    explanation: 'Thủy ngân (kí hiệu Hg) có nhiệt độ nóng chảy thấp (-38.83°C) nên ở trạng thái lỏng ở nhiệt độ phòng.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-9',
    question: 'Tia nào trong ánh nắng mặt trời có khả năng kích thích cơ thể người tổng hợp Vitamin D tự nhiên?',
    options: ['Tia hồng ngoại', 'Tia tử ngoại (UV)', 'Tia X', 'Tia Gamma'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'medium',
    explanation: 'Tia cực tím (tia tử ngoại UVB) trong ánh sáng mặt trời giúp chuyển hóa tiền vitamin D dưới da thành Vitamin D3.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'sci-10',
    question: 'Hiện tượng tán sắc ánh sáng mặt trời qua các giọt nước mưa trong khí quyển tạo nên hiện tượng thiên nhiên tuyệt đẹp nào?',
    options: ['Nhật thực', 'Cầu vồng', 'Cực quang', 'Sao băng'],
    correctIndex: 1,
    category: 'Khoa học',
    difficulty: 'easy',
    explanation: 'Cầu vồng hình thành do ánh sáng mặt trời bị khúc xạ, phản xạ toàn phần và tán sắc khi đi qua các giọt nước mưa li ti.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 7. CHỦ ĐỀ: VĂN HỌC (10 CÂU)
  // ==========================================
  {
    id: 'lit-1',
    question: 'Kiệt tác văn học "Truyện Kiều" của Đại thi hào Nguyễn Du được viết hoàn toàn theo thể thơ truyền thống nào?',
    options: ['Thơ thất ngôn bát cú', 'Thơ lục bát', 'Thơ song thất lục bát', 'Thơ tự do'],
    correctIndex: 1,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Truyện Kiều (Đoạn trường tân thanh) gồm 3.254 câu thơ lục bát bất hủ, đỉnh cao của văn học chữ Nôm Việt Nam.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-2',
    question: 'Ai là tác giả của tập hồi ký thiếu nhi nổi tiếng "Dế Mèn phiêu lưu ký"?',
    options: ['Tô Hoài', 'Nguyễn Nhật Ánh', 'Nam Cao', 'Vũ Trọng Phụng'],
    correctIndex: 0,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Nhà văn Tô Hoài sáng tác tác phẩm "Dế Mèn phiêu lưu ký" vào năm 1941, được dịch ra hàng chục thứ tiếng trên thế giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-3',
    question: 'Nhân vật lão Hạc trong truyện ngắn hiện thực xuất sắc cùng tên của Nam Cao nuôi một chú chó được gọi thân mật là gì?',
    options: ['Cậu Vàng', 'Cậu Vện', 'Chú Mực', 'Cậu Mun'],
    correctIndex: 0,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Lão Hạc yêu quý gọi chú chó kỷ vật của con trai mình là "cậu Vàng".',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-4',
    question: 'Tập thơ chữ Hán "Nhật ký trong tù" (Ngục trung nhật ký) là tác phẩm của ai?',
    options: ['Phan Bội Châu', 'Hồ Chí Minh', 'Tố Hữu', 'Xuân Diệu'],
    correctIndex: 1,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: '"Nhật ký trong tù" gồm 133 bài thơ chữ Hán được Chủ tịch Hồ Chí Minh sáng tác trong thời gian bị chính quyền Tưởng Giới Thạch giam giữ vô cớ (1942 - 1943).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-5',
    question: 'Nhà thơ nào được mệnh danh là "Ông hoàng thơ tình" của nền thơ mới Việt Nam?',
    options: ['Huy Cận', 'Xuân Diệu', 'Hàn Mặc Tử', 'Chế Lan Viên'],
    correctIndex: 1,
    category: 'Văn học',
    difficulty: 'medium',
    explanation: 'Xuân Diệu được nhà phê bình Hoài Thanh gọi là "nhà thơ mới nhất trong các nhà thơ mới" và được mệnh danh là ông hoàng thơ tình.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-6',
    question: 'Truyền thuyết dân gian nào giải thích nguồn gốc các giống nòi dân tộc Việt Nam cùng sinh ra từ một bọc trăm trứng?',
    options: ['Thánh Gióng', 'Lạc Long Quân và Âu Cơ', 'Sơn Tinh Thủy Tinh', 'Bánh chưng bánh giầy'],
    correctIndex: 1,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Truyền thuyết Lạc Long Quân và Âu Cơ sinh ra bọc trăm trứng nở thành trăm người con, giải thích hai chữ thiêng liêng "Đồng bào".',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-7',
    question: 'Bài thơ "Lượm" viết về chú bé liên lạc dũng cảm, hồn nhiên hy sinh trong kháng chiến chống Pháp là của nhà thơ nào?',
    options: ['Tố Hữu', 'Quang Dũng', 'Chính Hữu', 'Phạm Tiến Duật'],
    correctIndex: 0,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Nhà thơ cách mạng Tố Hữu sáng tác bài thơ "Lượm" năm 1949: "Chú bé loắt choắt / Cái xắc xinh xinh / Cái chân thoăn thoắt / Cái đầu nghênh nghênh...".',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-8',
    question: 'Tác phẩm văn xuôi lịch sử "Hoàng Lê nhất thống chí" do nhóm tác giả nào thuộc dòng họ Ngô biên soạn?',
    options: ['Ngô gia văn phái', 'Trần tộc văn phái', 'Lê gia văn phái', 'Nguyễn tộc văn phái'],
    correctIndex: 0,
    category: 'Văn học',
    difficulty: 'medium',
    explanation: '"Hoàng Lê nhất thống chí" là tiểu thuyết lịch sử chương hồi nổi tiếng do các tác giả thuộc Ngô gia văn phái (Ngô Thì Chí, Ngô Thì Du...) sáng tác.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-9',
    question: 'Nữ sĩ nào được tôn vinh là "Bà chúa thơ Nôm" với những bài thơ tứ tuyệt tài hoa và cá tính độc đáo?',
    options: ['Đoàn Thị Điểm', 'Hồ Xuân Hương', 'Bà Huyện Thanh Quan', 'Sương Nguyệt Anh'],
    correctIndex: 1,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Hồ Xuân Hương được nhà thơ Xuân Diệu tôn vinh là "Bà chúa thơ Nôm" và được UNESCO vinh danh Danh nhân văn hóa thế giới.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'lit-10',
    question: 'Nhân vật chị Dậu giàu đức hy sinh và tinh thần phản kháng mạnh mẽ xuất hiện trong tác phẩm nào của Ngô Tất Tố?',
    options: ['Tắt đèn', 'Số đỏ', 'Bước đường cùng', 'Bỉ vỏ'],
    correctIndex: 0,
    category: 'Văn học',
    difficulty: 'easy',
    explanation: 'Chị Dậu là nhân vật chính kiên cường trong tiểu thuyết hiện thực phê phán "Tắt đèn" (1939) của nhà văn Ngô Tất Tố.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },

  // ==========================================
  // 8. CHỦ ĐỀ: TỔNG HỢP (10 CÂU)
  // ==========================================
  {
    id: 'gen-1',
    question: 'Đơn vị tiền tệ chính thức của đất nước Nhật Bản là gì?',
    options: ['Won', 'Yuan (Nhân dân tệ)', 'Yen (Yên)', 'Baht'],
    correctIndex: 2,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Yen Nhật (kí hiệu ¥) là đơn vị tiền tệ chính thức của Nhật Bản.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-2',
    question: 'Lễ hội Đền Hùng tưởng nhớ công ơn các vua Hùng dựng nước diễn ra vào ngày âm lịch nào hàng năm?',
    options: ['Mùng 1 tháng Giêng', 'Mùng 10 tháng 3', 'Rằm tháng 8', 'Ngày 2 tháng 9'],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: '"Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba" (10/3 Âm lịch hàng năm).',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-3',
    question: 'Biểu tượng Olympic quốc tế gồm bao nhiêu vòng tròn đan lồng vào nhau?',
    options: ['4 vòng tròn', '5 vòng tròn', '6 vòng tròn', '7 vòng tròn'],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Biểu tượng Thế vận hội Olympic gồm 5 vòng tròn lồng vào nhau (xanh dương, vàng, đen, xanh lá, đỏ) đại diện cho 5 châu lục gắn kết.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-4',
    question: 'Quốc hoa chính thức của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là loài hoa nào?',
    options: ['Hoa Mai', 'Hoa Đào', 'Hoa Sen', 'Hoa Cúc'],
    correctIndex: 2,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Hoa Sen tượng trưng cho vẻ đẹp thanh cao, tinh khiết, ý chí kiên cường và bản sắc tâm hồn dân tộc Việt Nam.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-5',
    question: 'Giải thưởng danh giá nào trên thế giới được trao hàng năm cho các thành tựu xuất sắc về Vật lý, Hóa học, Y học, Văn học, Hòa bình và Kinh tế?',
    options: ['Giải Oscar', 'Giải Nobel', 'Giải Grammy', 'Giải Pulitzer'],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Giải Nobel được sáng lập theo di chúc của nhà phát minh người Thụy Điển Alfred Nobel từ năm 1901.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-6',
    question: 'Theo luật giao thông đường bộ Việt Nam, khi gặp đèn tín hiệu giao thông chuyển sang màu vàng thì người điều khiển phương tiện phải làm gì?',
    options: [
      'Tăng tốc thật nhanh để vượt qua ngã tư',
      'Dừng lại trước vạch dừng (trừ trường hợp đã đi quá vạch dừng)',
      'Bấm còi liên tục',
      'Được phép rẽ trái tự do'
    ],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Tín hiệu đèn vàng báo hiệu phải dừng lại trước vạch dừng, trừ trường hợp đã đi quá vạch dừng thì được tiếp tục đi.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-7',
    question: 'Nhạc cụ dân tộc truyền thống nào của Việt Nam chỉ có đúng một dây duy nhất mà phát ra âm thanh du dương, trầm bổng?',
    options: ['Đàn tranh', 'Đàn nguyệt', 'Đàn bầu (Độc huyền cầm)', 'Đàn tơ rưng'],
    correctIndex: 2,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Đàn bầu (còn gọi là Độc huyền cầm) chỉ có một dây duy nhất kết hợp với cần đàn uốn lượn để tạo ra các nốt cao độ bồi âm phong phú.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-8',
    question: 'Môn thể thao nào được người hâm mộ khắp năm châu tôn vinh là "Môn thể thao vua"?',
    options: ['Bóng rổ', 'Bóng đá', 'Quần vợt (Tennis)', 'Điền kinh'],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Bóng đá là môn thể thao có lượng người xem và người chơi đông đảo nhất hành tinh nên được tôn vinh là môn thể thao vua.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-9',
    question: 'Việt Nam hiện nay có bao nhiêu dân tộc anh em cùng chung sống hòa thuận trên dải đất hình chữ S?',
    options: ['52 dân tộc', '54 dân tộc', '56 dân tộc', '60 dân tộc'],
    correctIndex: 1,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'Cộng đồng các dân tộc Việt Nam gồm 54 dân tộc anh em, trong đó người Kinh chiếm đa số.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  },
  {
    id: 'gen-10',
    question: 'Tổ chức Y tế Thế giới viết tắt là gì?',
    options: ['UNESCO', 'UNICEF', 'WHO', 'WTO'],
    correctIndex: 2,
    category: 'Tổng hợp',
    difficulty: 'easy',
    explanation: 'WHO là viết tắt của World Health Organization (Tổ chức Y tế Thế giới) thuộc Liên Hợp Quốc.',
    source: 'default',
    timesAnswered: 0,
    timesCorrect: 0
  }
];
