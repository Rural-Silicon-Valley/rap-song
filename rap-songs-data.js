// 说唱歌曲数据库 - 每个区域50首
const rapSongsData = {
    chinese: [
        { title: "光年之外", artist: "GAI周延", id: 101 },
        { title: "苦行僧", artist: "GAI周延", id: 102 },
        { title: "火锅底料", artist: "GAI周延", id: 103 },
        { title: "我的新衣", artist: "VAVA", id: 104 },
        { title: "耳朵", artist: "李荣浩", id: 105 },
        { title: "作曲家", artist: "李荣浩", id: 106 },
        { title: "像我这样的人", artist: "毛不易", id: 107 },
        { title: "消愁", artist: "毛不易", id: 108 },
        { title: "说散就散", artist: "袁娅维", id: 109 },
        { title: "起风了", artist: "买辣椒也用券", id: 110 },
        { title: "海底", artist: "一支榴莲", id: 111 },
        { title: "下山", artist: "要不要买菜", id: 112 },
        { title: "大田后生仔", artist: "林启得", id: 113 },
        { title: "踏山河", artist: "是七叔呢", id: 114 },
        { title: "可可托海的牧羊人", artist: "王琪", id: 115 },
        { title: "送你一朵小红花", artist: "赵英俊", id: 116 },
        { title: "盗将行", artist: "花粥", id: 117 },
        { title: "纸短情长", artist: "烟把儿", id: 118 },
        { title: "绿色", artist: "陈雪凝", id: 119 },
        { title: "世间美好与你环环相扣", artist: "柏松", id: 120 },
        { title: "桥边姑娘", artist: "海伦", id: 121 },
        { title: "你的答案", artist: "阿冗", id: 122 },
        { title: "芒种", artist: "音阙诗听", id: 123 },
        { title: "红昭愿", artist: "音阙诗听", id: 124 },
        { title: "琵琶行", artist: "奇然", id: 125 },
        { title: "赤伶", artist: "HITA", id: 126 },
        { title: "大鱼", artist: "周深", id: 127 },
        { title: "光亮", artist: "周深", id: 128 },
        { title: "达拉崩吧", artist: "周深", id: 129 },
        { title: "无羁", artist: "肖战", id: 130 },
        { title: "陈情令", artist: "王一博", id: 131 },
        { title: "野狼disco", artist: "宝石Gem", id: 132 },
        { title: "漠河舞厅", artist: "柳爽", id: 133 },
        { title: "四季予你", artist: "程响", id: 134 },
        { title: "白月光与朱砂痣", artist: "大籽", id: 135 },
        { title: "星辰大海", artist: "黄霄云", id: 136 },
        { title: "飞鸟和蝉", artist: "任然", id: 137 },
        { title: "清空", artist: "王忻辰", id: 138 },
        { title: "孤勇者", artist: "陈奕迅", id: 139 },
        { title: "稻香", artist: "周杰伦", id: 140 },
        { title: "晴天", artist: "周杰伦", id: 141 },
        { title: "告白气球", artist: "周杰伦", id: 142 },
        { title: "等你下课", artist: "周杰伦", id: 143 },
        { title: "说好不哭", artist: "周杰伦", id: 144 },
        { title: "Mojito", artist: "周杰伦", id: 145 },
        { title: "最伟大的作品", artist: "周杰伦", id: 146 },
        { title: "倒数", artist: "邓紫棋", id: 147 },
        { title: "光年之外", artist: "邓紫棋", id: 148 },
        { title: "泡沫", artist: "邓紫棋", id: 149 },
        { title: "喜欢你", artist: "邓紫棋", id: 150 }
    ],
    western: [
        { title: "Lose Yourself", artist: "Eminem", id: 201 },
        { title: "Not Afraid", artist: "Eminem", id: 202 },
        { title: "Without Me", artist: "Eminem", id: 203 },
        { title: "HUMBLE.", artist: "Kendrick Lamar", id: 204 },
        { title: "DNA.", artist: "Kendrick Lamar", id: 205 },
        { title: "Stronger", artist: "Kanye West", id: 206 },
        { title: "Power", artist: "Kanye West", id: 207 },
        { title: "SICKO MODE", artist: "Travis Scott", id: 208 },
        { title: "goosebumps", artist: "Travis Scott", id: 209 },
        { title: "God's Plan", artist: "Drake", id: 210 },
        { title: "One Dance", artist: "Drake", id: 211 },
        { title: "In Da Club", artist: "50 Cent", id: 212 },
        { title: "Still D.R.E.", artist: "Dr. Dre", id: 213 },
        { title: "The Next Episode", artist: "Dr. Dre", id: 214 },
        { title: "Juicy", artist: "The Notorious B.I.G.", id: 215 },
        { title: "Stir Fry", artist: "Migos", id: 216 },
        { title: "Rap God", artist: "Eminem", id: 217 },
        { title: "Stan", artist: "Eminem", id: 218 },
        { title: "The Real Slim Shady", artist: "Eminem", id: 219 },
        { title: "Mockingbird", artist: "Eminem", id: 220 },
        { title: "Love The Way You Lie", artist: "Eminem", id: 221 },
        { title: "Alright", artist: "Kendrick Lamar", id: 222 },
        { title: "LOYALTY.", artist: "Kendrick Lamar", id: 223 },
        { title: "King Kunta", artist: "Kendrick Lamar", id: 224 },
        { title: "Swimming Pools", artist: "Kendrick Lamar", id: 225 },
        { title: "Gold Digger", artist: "Kanye West", id: 226 },
        { title: "Heartless", artist: "Kanye West", id: 227 },
        { title: "All of the Lights", artist: "Kanye West", id: 228 },
        { title: "Runaway", artist: "Kanye West", id: 229 },
        { title: "Ni**as in Paris", artist: "Jay-Z & Kanye West", id: 230 },
        { title: "HIGHEST IN THE ROOM", artist: "Travis Scott", id: 231 },
        { title: "Antidote", artist: "Travis Scott", id: 232 },
        { title: "Butterfly Effect", artist: "Travis Scott", id: 233 },
        { title: "Hotline Bling", artist: "Drake", id: 234 },
        { title: "In My Feelings", artist: "Drake", id: 235 },
        { title: "Nice For What", artist: "Drake", id: 236 },
        { title: "Started From The Bottom", artist: "Drake", id: 237 },
        { title: "Candy Shop", artist: "50 Cent", id: 238 },
        { title: "P.I.M.P.", artist: "50 Cent", id: 239 },
        { title: "21 Questions", artist: "50 Cent", id: 240 },
        { title: "Forgot About Dre", artist: "Dr. Dre", id: 241 },
        { title: "Nuthin' but a 'G' Thang", artist: "Dr. Dre", id: 242 },
        { title: "Big Poppa", artist: "The Notorious B.I.G.", id: 243 },
        { title: "Hypnotize", artist: "The Notorious B.I.G.", id: 244 },
        { title: "Mo Money Mo Problems", artist: "The Notorious B.I.G.", id: 245 },
        { title: "Bad and Boujee", artist: "Migos", id: 246 },
        { title: "Walk It Talk It", artist: "Migos", id: 247 },
        { title: "MotorSport", artist: "Migos", id: 248 },
        { title: "T-Shirt", artist: "Migos", id: 249 },
        { title: "Slippery", artist: "Migos", id: 250 }
    ],
    asian: [
        { title: "Dynamite", artist: "BTS", id: 301 },
        { title: "Butter", artist: "BTS", id: 302 },
        { title: "Boy With Luv", artist: "BTS", id: 303 },
        { title: "DNA", artist: "BTS", id: 304 },
        { title: "DDU-DU DDU-DU", artist: "BLACKPINK", id: 305 },
        { title: "How You Like That", artist: "BLACKPINK", id: 306 },
        { title: "Kill This Love", artist: "BLACKPINK", id: 307 },
        { title: "Pink Venom", artist: "BLACKPINK", id: 308 },
        { title: "FANTASTIC BABY", artist: "BIGBANG", id: 309 },
        { title: "BANG BANG BANG", artist: "BIGBANG", id: 310 },
        { title: "Untitled, 2014", artist: "G-DRAGON", id: 311 },
        { title: "CROOKED", artist: "G-DRAGON", id: 312 },
        { title: "Gangnam Style", artist: "PSY", id: 313 },
        { title: "Gentleman", artist: "PSY", id: 314 },
        { title: "Love Scenario", artist: "iKON", id: 315 },
        { title: "Mic Drop", artist: "BTS", id: 316 },
        { title: "IDOL", artist: "BTS", id: 317 },
        { title: "Fake Love", artist: "BTS", id: 318 },
        { title: "Blood Sweat & Tears", artist: "BTS", id: 319 },
        { title: "Spring Day", artist: "BTS", id: 320 },
        { title: "Fire", artist: "BTS", id: 321 },
        { title: "Save ME", artist: "BTS", id: 322 },
        { title: "ON", artist: "BTS", id: 323 },
        { title: "Black Swan", artist: "BTS", id: 324 },
        { title: "Life Goes On", artist: "BTS", id: 325 },
        { title: "BOOMBAYAH", artist: "BLACKPINK", id: 326 },
        { title: "As If It's Your Last", artist: "BLACKPINK", id: 327 },
        { title: "Forever Young", artist: "BLACKPINK", id: 328 },
        { title: "Lovesick Girls", artist: "BLACKPINK", id: 329 },
        { title: "Ice Cream", artist: "BLACKPINK", id: 330 },
        { title: "Shut Down", artist: "BLACKPINK", id: 331 },
        { title: "Playing With Fire", artist: "BLACKPINK", id: 332 },
        { title: "Stay", artist: "BLACKPINK", id: 333 },
        { title: "Whistle", artist: "BLACKPINK", id: 334 },
        { title: "HARU HARU", artist: "BIGBANG", id: 335 },
        { title: "Lies", artist: "BIGBANG", id: 336 },
        { title: "Last Dance", artist: "BIGBANG", id: 337 },
        { title: "Loser", artist: "BIGBANG", id: 338 },
        { title: "IF YOU", artist: "BIGBANG", id: 339 },
        { title: "That XX", artist: "G-DRAGON", id: 340 },
        { title: "Heartbreaker", artist: "G-DRAGON", id: 341 },
        { title: "Who You?", artist: "G-DRAGON", id: 342 },
        { title: "Daddy", artist: "PSY", id: 343 },
        { title: "New Face", artist: "PSY", id: 344 },
        { title: "Rhythm Ta", artist: "iKON", id: 345 },
        { title: "Killing Me", artist: "iKON", id: 346 },
        { title: "Goodbye Road", artist: "iKON", id: 347 },
        { title: "Why Why Why", artist: "iKON", id: 348 },
        { title: "Airplane", artist: "iKON", id: 349 },
        { title: "Bling Bling", artist: "iKON", id: 350 }
    ]
};

// 生成专辑卡片HTML
function generateAlbumCard(song) {
    return `
        <div class="album-card">
            <img src="https://picsum.photos/300/300?random=${song.id}" alt="专辑封面" class="album-cover">
            <div class="album-info">
                <div class="album-title">${song.title}</div>
                <div class="album-artist">${song.artist}</div>
                <a href="https://music.163.com/#/search/m/?s=${encodeURIComponent(song.title + ' ' + song.artist)}" target="_blank" class="listen-button">🎵 试听</a>
            </div>
        </div>
    `;
}

// 初始化歌单
function initializeSongs() {
    // 国语区
    const chineseTrack = document.querySelector('#chinese .albums-track');
    if (chineseTrack) {
        chineseTrack.innerHTML = rapSongsData.chinese.map(song => generateAlbumCard(song)).join('');
    }
    
    // 欧美区
    const westernTrack = document.querySelector('#western .albums-track');
    if (westernTrack) {
        westernTrack.innerHTML = rapSongsData.western.map(song => generateAlbumCard(song)).join('');
    }
    
    // 日韩区
    const asianTrack = document.querySelector('#asian .albums-track');
    if (asianTrack) {
        asianTrack.innerHTML = rapSongsData.asian.map(song => generateAlbumCard(song)).join('');
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSongs);
} else {
    initializeSongs();
}
