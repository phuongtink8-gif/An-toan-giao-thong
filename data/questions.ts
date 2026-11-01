export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionItem {
  id: number;
  question: string;
  options: QuestionOption[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: 'An toàn đi bộ & xe máy' | 'Quy tắc qua đường' | 'Đèn tín hiệu & Ưu tiên' | 'Quy định xe đạp' | 'Biển báo giao thông';
  signType?: 'cam_xe_dap' | 'cam_nguoi_di_bo' | 'duong_nguoi_di_bo' | 'han_che_toc_do_40' | 'giao_duong_sat_rao_chan';
  icon: string;
  checkpointTitle: string;
  funFact: string;
}

export const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 1,
    question: "Khi tham gia giao thông, trường hợp nào dưới đây là không an toàn, gây nguy hiểm?",
    options: [
      { key: 'A', text: "Không đội mũ bảo hiểm khi ngồi trên xe mô tô, xe máy." },
      { key: 'B', text: "Đi qua đường cùng người lớn." },
      { key: 'C', text: "Đi xe đạp chở 1 người ngồi sau." },
      { key: 'D', text: "Đi bộ trên vỉa hè, nơi dành cho người đi bộ." }
    ],
    correctKey: 'A',
    explanation: "Đội mũ bảo hiểm bảo vệ đầu của chúng mình khi ngồi trên xe máy! Không đội mũ bảo hiểm là rất nguy hiểm và vi phạm luật giao thông đấy bé nhé.",
    category: "An toàn đi bộ & xe máy",
    icon: "ShieldAlert",
    checkpointTitle: "Trạm 1: Mũ bảo hiểm thân yêu",
    funFact: "Chiếc mũ bảo hiểm đạt chuẩn vừa vặn sẽ bảo vệ vùng đầu tới 85% trước các va đập!"
  },
  {
    id: 2,
    question: "Khi qua đường nên:",
    options: [
      { key: 'A', text: "Nắm tay nhau chạy qua đường." },
      { key: 'B', text: "Qua đường ở nơi bị che khuất." },
      { key: 'C', text: "Đi vào vạch kẻ đi bộ qua đường; nếu không có vạch thì chọn nơi an toàn, quan sát kỹ xe trên đường rồi mới qua." },
      { key: 'D', text: "Vừa đi vừa nhìn điện thoại." }
    ],
    correctKey: 'C',
    explanation: "Khi qua đường, các em hãy luôn đi đúng vạch ngựa vằn trắng dành cho người đi bộ. Luôn dừng lại, ngó trái, ngó phải rồi mới cẩn thận bước qua!",
    category: "Quy tắc qua đường",
    icon: "Footprints",
    checkpointTitle: "Trạm 2: Vạch kẻ ngựa vằn",
    funFact: "Vạch đi bộ qua đường ở Việt Nam còn được các bạn nhỏ gọi yêu là 'vạch ngựa vằn' (Zebra crossing)!"
  },
  {
    id: 3,
    question: "Em cùng các bạn đi học về thấy một số bạn chơi đùa trên đường, em sẽ làm gì?",
    options: [
      { key: 'A', text: "Vui chơi cùng các bạn." },
      { key: 'B', text: "Chạy đuổi nhau trên đường." },
      { key: 'C', text: "Lờ đi và tiếp tục đi bình thường." },
      { key: 'D', text: "Nhắc các bạn không chơi đùa trên đường vì không an toàn." }
    ],
    correctKey: 'D',
    explanation: "Đường phố có rất nhiều phương tiện qua lại chạy nhanh. Nhắc nhở bạn bè không đá bóng hay đùa giỡn dưới lòng đường là hành động của một bé ngoan, dũng cảm!",
    category: "An toàn đi bộ & xe máy",
    icon: "Users",
    checkpointTitle: "Trạm 3: Bạn ngoan nhắc nhở",
    funFact: "Sân trường và công viên mới là nơi an toàn và tuyệt vời nhất để chúng mình vui chơi đá bóng!"
  },
  {
    id: 4,
    question: "Em được người lớn đèo bằng xe máy đi trên đường, em phải ngồi thế nào cho an toàn?",
    options: [
      { key: 'A', text: "Đội mũ bảo hiểm và ngồi trước người lớn." },
      { key: 'B', text: "Đội mũ bảo hiểm, ngồi sau người lớn và bám chắc vào người lớn." },
      { key: 'C', text: "Ngồi sau người lớn nhưng không cần đội mũ bảo hiểm." },
      { key: 'D', text: "Đứng trên xe để dễ quan sát." }
    ],
    correctKey: 'B',
    explanation: "Tư thế an toàn nhất: Đội mũ bảo hiểm cài quai ngay ngắn, ngồi ngay ngắn phía sau người lớn, hai tay ôm hoặc bám chặt vào eo người lớn và hai chân đặt đúng gác chân!",
    category: "An toàn đi bộ & xe máy",
    icon: "Bike",
    checkpointTitle: "Trạm 4: Bé ngồi sau xe máy",
    funFact: "Ngồi trước hoặc đứng trên xe máy rất dễ bị mất thăng bằng hoặc va vào tay lái khi phanh gấp!"
  },
  {
    id: 5,
    question: "Các hành động nào dưới đây khi tham gia giao thông là đúng?",
    options: [
      { key: 'A', text: "Ngồi trên xe ô tô nghiêm túc, không mở cửa hoặc thò đầu, tay, chân ra ngoài." },
      { key: 'B', text: "Ngồi sau xe máy dang hai tay, chân khi xe chạy trên đường." },
      { key: 'C', text: "Bám vào sau xe ô tô khi xe đang chạy." },
      { key: 'D', text: "Điều khiển xe đạp nhưng buông hai tay khỏi tay lái." }
    ],
    correctKey: 'A',
    explanation: "Khi ngồi trong ô tô hay xe buýt, tuyệt đối không thò đầu, thò tay ra ngoài cửa sổ vì các xe khác chạy qua có thể gây nguy hiểm nghiêm trọng!",
    category: "An toàn đi bộ & xe máy",
    icon: "Car",
    checkpointTitle: "Trạm 5: Hành khách ô tô lịch sự",
    funFact: "Thắt dây an toàn trên ô tô sẽ giúp chúng mình luôn ngồi êm ái và an toàn suốt chuyến đi!"
  },
  {
    id: 6,
    question: "Khi đi đến nơi có vạch kẻ đường dành cho người đi bộ, hành động nào sau đây của người điều khiển phương tiện giao thông là đúng quy tắc?",
    options: [
      { key: 'A', text: "Vẫn giữ tốc độ và không cần chú ý người đi bộ." },
      { key: 'B', text: "Dừng lại, dắt xe qua vạch kẻ đường trong mọi trường hợp." },
      { key: 'C', text: "Quan sát, giảm tốc độ, nhường đường cho người đi bộ." },
      { key: 'D', text: "Giảm tốc độ rồi vượt qua phía trước người đi bộ." }
    ],
    correctKey: 'C',
    explanation: "Vạch đi bộ là khu vực ưu tiên cho người đi bộ. Tất cả các phương tiện xe đạp, xe máy, ô tô khi đến đây đều phải giảm tốc độ và nhường đường!",
    category: "Quy tắc qua đường",
    icon: "Eye",
    checkpointTitle: "Trạm 6: Nhường đường văn minh",
    funFact: "Văn hóa giao thông đẹp nhất là nụ cười và hành động nhường đường cho các bạn nhỏ và người cao tuổi!"
  },
  {
    id: 7,
    question: "Khi đi qua chỗ đường giao nhau có tín hiệu đèn, em cần chú ý điều gì?",
    options: [
      { key: 'A', text: "Nhờ người lớn dẫn qua đường trong mọi trường hợp." },
      { key: 'B', text: "Không chú ý tín hiệu đèn, cứ đi sát lề đường bên phải." },
      { key: 'C', text: "Chỉ để ý người tham gia giao thông khác, không cần nhìn đèn." },
      { key: 'D', text: "Quan sát kỹ tín hiệu đèn giao thông; khi đèn xanh bật mới được đi." }
    ],
    correctKey: 'D',
    explanation: "Quy tắc đèn giao thông 3 màu diệu kỳ: Đèn Đỏ phải dừng lại, Đèn Vàng chậm lại chuẩn bị dừng, và Đèn Xanh bật sáng thì mới được an toàn di chuyển!",
    category: "Đèn tín hiệu & Ưu tiên",
    icon: "TrafficCone",
    checkpointTitle: "Trạm 7: Chú đèn giao thông",
    funFact: "Đèn tín hiệu giao thông đầu tiên trên thế giới được lắp đặt tại London từ năm 1868!"
  },
  {
    id: 8,
    question: "Người điều khiển xe đạp được chở tối đa mấy người?",
    options: [
      { key: 'A', text: "Hai người lớn." },
      { key: 'B', text: "Một người lớn và một trẻ em dưới 7 tuổi." },
      { key: 'C', text: "Chở bao nhiêu người cũng được." },
      { key: 'D', text: "Một người lớn và một trẻ em trên 7 tuổi." }
    ],
    correctKey: 'B',
    explanation: "Theo Luật Giao thông đường bộ, người đi xe đạp chỉ được chở thêm 1 người lớn phía sau, và có thể chở thêm tối đa 1 em bé dưới 7 tuổi nữa thôi nhé!",
    category: "Quy định xe đạp",
    icon: "Bike",
    checkpointTitle: "Trạm 8: Chiếc xe đạp vui vẻ",
    funFact: "Chở quá nhiều người làm xe đạp khó giữ thăng bằng và phanh không ăn, rất dễ ngã đấy!"
  },
  {
    id: 9,
    question: "Khi đèn tín hiệu giao thông màu vàng bật sáng, người điều khiển phương tiện đi chưa đến vạch dừng thì phải làm gì?",
    options: [
      { key: 'A', text: "Tiếp tục đi nhưng phải chú ý quan sát." },
      { key: 'B', text: "Được đi tiếp nhưng chỉ được rẽ trái." },
      { key: 'C', text: "Dừng lại trước vạch dừng." },
      { key: 'D', text: "Được đi tiếp nhưng chỉ được rẽ phải." }
    ],
    correctKey: 'C',
    explanation: "Khi thấy đèn vàng và xe chưa tới vạch dừng, người điều khiển phải giảm tốc độ và dừng lại trước vạch dừng ngay để chuẩn bị sang đèn đỏ an toàn!",
    category: "Đèn tín hiệu & Ưu tiên",
    icon: "AlertCircle",
    checkpointTitle: "Trạm 9: Tín hiệu đèn vàng",
    funFact: "Đèn vàng không phải là tín hiệu 'phóng thật nhanh để kịp qua', mà là tín hiệu yêu cầu dừng lại an toàn!"
  },
  {
    id: 10,
    question: "Tìm phát biểu đúng trong những phát biểu dưới đây:",
    options: [
      { key: 'A', text: "Xe mô tô, xe gắn máy chỉ được chở thêm tối đa 1 người trong tất cả các trường hợp." },
      { key: 'B', text: "Đến ngã tư, gặp đèn đỏ thì mọi phương tiện phải dừng lại, không có ngoại lệ." },
      { key: 'C', text: "Mọi hành vi điều khiển phương tiện đi ngược chiều đều bị coi là vi phạm luật giao thông." },
      { key: 'D', text: "Quy tắc giao thông là thống nhất nhưng luật vẫn quy định một số trường hợp ngoại lệ và một số xe được quyền ưu tiên." }
    ],
    correctKey: 'D',
    explanation: "Luật giao thông có các trường hợp xe ưu tiên đặc biệt khi đang làm nhiệm vụ khẩn cấp (như xe cứu hỏa, cứu thương, công an) được đi thẳng ngay cả khi đèn đỏ!",
    category: "Đèn tín hiệu & Ưu tiên",
    icon: "CheckCircle",
    checkpointTitle: "Trạm 10: Quy tắc & Ngoại lệ",
    funFact: "Khi nghe thấy còi hú của xe cứu hỏa hoặc cứu thương, tất cả mọi người trên đường đều chủ động nhường đường!"
  },
  {
    id: 11,
    question: "Người điều khiển xe đạp không được thực hiện những hành vi nào dưới đây?",
    options: [
      { key: 'A', text: "Đi xe dàn hàng ngang, đi xe vào phần đường dành cho người đi bộ và phương tiện khác." },
      { key: 'B', text: "Sử dụng ô, điện thoại di động, thiết bị âm thanh (trừ thiết bị trợ thính); dùng xe kéo, đẩy xe hoặc vật khác; mang, vác, chở vật cồng kềnh." },
      { key: 'C', text: "Buông cả hai tay hoặc đi xe bằng một bánh đối với xe hai bánh, bằng hai bánh đối với xe ba bánh." },
      { key: 'D', text: "Tất cả các hành vi trên." }
    ],
    correctKey: 'D',
    explanation: "Tất cả các hành vi dàn hàng ngang, buông hai tay, che ô hay bấm điện thoại khi đi xe đạp đều vô cùng nguy hiểm và bị nghiêm cấm theo luật!",
    category: "Quy định xe đạp",
    icon: "Ban",
    checkpointTitle: "Trạm 11: Cua-rơ nhí chuẩn mực",
    funFact: "Luôn đặt 2 tay vững chắc trên ghi-đông xe đạp giúp bé xử lý nhanh mọi chướng ngại vật phía trước!"
  },
  {
    id: 12,
    question: "Phương tiện giao thông nào được ưu tiên khi tham gia giao thông?",
    options: [
      { key: 'A', text: "Xe đưa đón học sinh." },
      { key: 'B', text: "Xe chở hàng." },
      { key: 'C', text: "Xe cứu hỏa." },
      { key: 'D', text: "Xe cẩu." }
    ],
    correctKey: 'C',
    explanation: "Xe cứu hỏa (chữa cháy) đang đi làm nhiệm vụ dập tắt hỏa hoạn khẩn cấp là xe ưu tiên số 1, được quyền đi trước tất cả các phương tiện khác!",
    category: "Đèn tín hiệu & Ưu tiên",
    icon: "Flame",
    checkpointTitle: "Trạm 12: Đội cứu hỏa anh hùng",
    funFact: "Xe cứu hỏa có màu đỏ rực rỡ và tiếng còi hụ vang dội để mọi người nghe thấy từ xa và kịp thời nép sang nhường đường!"
  },
  {
    id: 13,
    question: "Người ngồi trên xe mô tô hai bánh, ba bánh, xe gắn máy khi tham gia giao thông có được mang vác vật cồng kềnh hay không?",
    options: [
      { key: 'A', text: "Được mang, vác." },
      { key: 'B', text: "Không được mang, vác." },
      { key: 'C', text: "Được mang, vác nhưng phải bảo đảm an toàn." },
      { key: 'D', text: "Tùy trường hợp cụ thể." }
    ],
    correctKey: 'B',
    explanation: "Người ngồi sau xe máy tuyệt đối không được mang vác đồ đạc cồng kềnh vì sẽ che khuất tầm nhìn, vướng vào các xe khác và gây ngã xe!",
    category: "An toàn đi bộ & xe máy",
    icon: "PackageX",
    checkpointTitle: "Trạm 13: Gọn gàng khi đi xe",
    funFact: "Hàng hóa cồng kềnh cần được vận chuyển bằng các phương tiện chuyên dụng như xe tải hoặc xe kéo chuyên dùng!"
  },
  {
    id: 14,
    question: "Trẻ em bao nhiêu tuổi qua đường không cần người lớn đi kèm?",
    options: [
      { key: 'A', text: "Trên 10 tuổi." },
      { key: 'B', text: "Trên 7 tuổi." },
      { key: 'C', text: "Dưới 7 tuổi." },
      { key: 'D', text: "Trên 9 tuổi." }
    ],
    correctKey: 'B',
    explanation: "Theo Luật Giao thông đường bộ, trẻ em dưới 7 tuổi khi qua đường phải có người lớn dắt tay. Vì vậy, các bạn trên 7 tuổi đã có thể tự quan sát và qua đường an toàn!",
    category: "Quy tắc qua đường",
    icon: "Smile",
    checkpointTitle: "Trạm 14: Em lớn rồi đấy nhé",
    funFact: "Dù trên 7 tuổi, khi qua những ngã tư đông đúc, các bạn nhỏ vẫn nên đi cùng thầy cô, bố mẹ hoặc anh chị lớn nhé!"
  },
  {
    id: 15,
    question: "Biển báo dưới đây có ý nghĩa gì?",
    options: [
      { key: 'A', text: "Cấm xe máy." },
      { key: 'B', text: "Cấm ô tô." },
      { key: 'C', text: "Cấm xe đạp." },
      { key: 'D', text: "Cấm người đi bộ." }
    ],
    correctKey: 'C',
    explanation: "Biển hình tròn viền đỏ, nền trắng, vẽ hình chiếc xe đạp là Biển báo cấm số P.110a: 'Cấm xe đạp' lưu thông trên đoạn đường này!",
    category: "Biển báo giao thông",
    signType: "cam_xe_dap",
    icon: "OctagonAlert",
    checkpointTitle: "Trạm 15: Biển báo cấm xe đạp",
    funFact: "Các biển báo hình tròn viền đỏ thường là BIỂN CẤM, nhắc chúng mình điều không được làm!"
  },
  {
    id: 16,
    question: "Biển báo dưới đây có ý nghĩa gì?",
    options: [
      { key: 'A', text: "Đường dành cho người đi bộ." },
      { key: 'B', text: "Cấm người đi bộ." },
      { key: 'C', text: "Cấm xe đạp." },
      { key: 'D', text: "Hạn chế tốc độ tối đa." }
    ],
    correctKey: 'B',
    explanation: "Biển hình tròn viền đỏ, hình người đi bộ màu đen bị gạch chéo đỏ là Biển số P.112: 'Cấm người đi bộ'. Người đi bộ không được vào đoạn đường này (như đường cao tốc)!",
    category: "Biển báo giao thông",
    signType: "cam_nguoi_di_bo",
    icon: "UserX",
    checkpointTitle: "Trạm 16: Biển cấm người đi bộ",
    funFact: "Đường cao tốc dành cho ô tô chạy tốc độ rất cao nên người đi bộ tuyệt đối không được đi vào!"
  },
  {
    id: 17,
    question: "Biển báo dưới đây có ý nghĩa gì?",
    options: [
      { key: 'A', text: "Cấm người đi bộ." },
      { key: 'B', text: "Cấm xe đạp." },
      { key: 'C', text: "Giao nhau với đường sắt có rào chắn." },
      { key: 'D', text: "Đường dành cho người đi bộ." }
    ],
    correctKey: 'D',
    explanation: "Biển hình vuông/chữ nhật màu xanh dương, vẽ hình người bước qua vạch sọc trắng là Biển chỉ dẫn số I.423: 'Đường dành cho người đi bộ sang đường'!",
    category: "Biển báo giao thông",
    signType: "duong_nguoi_di_bo",
    icon: "Signpost",
    checkpointTitle: "Trạm 17: Nơi bé sang đường",
    funFact: "Biển báo hình vuông hoặc chữ nhật màu xanh nước biển thường là BIỂN CHỈ DẪN lối đi an toàn và thuận tiện!"
  },
  {
    id: 18,
    question: "Hãy cho biết biển này có ý nghĩa gì?",
    options: [
      { key: 'A', text: "Hết hạn chế tốc độ." },
      { key: 'B', text: "Đường dành cho người đi bộ." },
      { key: 'C', text: "Cấm đi ngược chiều." },
      { key: 'D', text: "Hạn chế tốc độ." }
    ],
    correctKey: 'D',
    explanation: "Biển hình tròn viền đỏ, bên trong ghi con số 40 là Biển P.127: 'Tốc độ tối đa cho phép' (hạn chế tốc độ), các xe không được chạy vượt quá 40 km/h!",
    category: "Biển báo giao thông",
    signType: "han_che_toc_do_40",
    icon: "Gauge",
    checkpointTitle: "Trạm 18: Biển giới hạn tốc độ",
    funFact: "Khi đi qua khu vực trường học đông các bạn nhỏ, các cô chú lái xe thường phải giảm tốc độ dưới 30 - 40 km/h!"
  },
  {
    id: 19,
    question: "Biển báo này có ý nghĩa gì?",
    options: [
      { key: 'A', text: "Giao nhau với đường sắt có rào chắn." },
      { key: 'B', text: "Đường dành cho người đi bộ." },
      { key: 'C', text: "Cấm xe đạp." },
      { key: 'D', text: "Hạn chế tốc độ." }
    ],
    correctKey: 'A',
    explanation: "Biển hình tam giác viền đỏ nền vàng, bên trong có hình hàng rào sắt là Biển báo nguy hiểm số W.210: 'Giao nhau với đường sắt có rào chắn', báo trước sắp tới đoàn tàu hỏa!",
    category: "Biển báo giao thông",
    signType: "giao_duong_sat_rao_chan",
    icon: "TrainTrack",
    checkpointTitle: "Trạm 19: Chú ý tàu hỏa chạy qua",
    funFact: "Biển hình tam giác nền vàng viền đỏ là BIỂN CẢNH BÁO NGUY HIỂM. Khi thấy tàu hỏa, rào chắn hạ xuống thì chúng mình đứng cách xa ít nhất 5 mét nhé!"
  }
];
