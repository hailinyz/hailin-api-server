export default function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 允许GET请求用于测试
  if (req.method === 'GET') {
    return res.json({ 
      message: 'HailinMusic API is working!', 
      timestamp: new Date().toISOString() 
    });
  }
  
  // 处理POST请求
  if (req.method === 'POST') {
    const { code } = req.body || {};
    
    // 邀请码列表
    const validCodes = {
      '69bddd4a-c884-4ca5-83e4-16c387dd542c': {
        type: 'vip',
        expires: null,
        description: '永久VIP邀请码'
      },
      'TEST2024': {
        type: 'trial',
        expires: '2024-12-31',
        description: '测试邀请码'
      },
      'VIP001': {
        type: 'standard',
        expires: '2025-08-13',
        description: '标准邀请码'
      }
    };
    
    if (!code) {
      return res.json({
        valid: false,
        message: '请提供邀请码',
        timestamp: new Date().toISOString()
      });
    }
    
    const invitation = validCodes[code];
    
    if (!invitation) {
      return res.json({
        valid: false,
        message: '邀请码不存在',
        timestamp: new Date().toISOString()
      });
    }
    
    // 检查过期时间
    if (invitation.expires && new Date() > new Date(invitation.expires + 'T23:59:59')) {
      return res.json({
        valid: false,
        message: `邀请码已于 ${invitation.expires} 过期`,
        timestamp: new Date().toISOString()
      });
    }
    
    // 验证成功
    return res.json({
      valid: true,
      message: '验证成功！欢迎使用 HailinMusic',
      userType: invitation.type,
      description: invitation.description,
      expiresAt: invitation.expires,
      timestamp: new Date().toISOString()
    });
  }
  
  // 其他方法不支持
  return res.status(405).json({ message: 'Method not allowed' });
} 