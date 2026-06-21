import { apiOptions } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export function GET(request: Request) {
  const origin = new URL(request.url).origin;

  const openapiSpec = {
    openapi: "3.1.0",
    info: {
      title: "Bình An App API Docs",
      version: "1.0.0",
      description: "Tài liệu đặc tả chi tiết và thử nghiệm REST API v1 cho ứng dụng di động Bình An."
    },
    servers: [{ url: `${origin}/api/v1`, description: "Server hiện tại" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Sử dụng access_token nhận được sau khi đăng nhập."
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Dữ liệu yêu cầu không hợp lệ." },
                details: { type: "object", nullable: true }
              },
              required: ["code", "message"]
            },
            request_id: { type: "string", format: "uuid" }
          },
          required: ["success", "error", "request_id"]
        },
        ConfigData: {
          type: "object",
          properties: {
            allow_registration: { type: "boolean" },
            public_community_enabled: { type: "boolean" },
            moderate_new_prayers: { type: "boolean" },
            community_page_size: { type: "integer" },
            support_email: { type: "string", format: "email" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            user_metadata: { type: "object" },
            created_at: { type: "string", format: "date-time" }
          }
        },
        Profile: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            display_name: { type: "string" },
            bio: { type: "string", nullable: true },
            avatar_url: { type: "string", format: "uri", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time", nullable: true }
          }
        },
        DailyMessage: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            message: { type: "string" },
            reflection_question: { type: "string", nullable: true },
            category: { type: "string", enum: ["peace", "hope", "gratitude"] },
            opened_date: { type: "string", format: "date" }
          }
        },
        Prayer: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            content: { type: "string" },
            type: { type: "string", enum: ["wish", "gratitude", "memorial", "worry", "peace"] },
            allow_reactions: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            reactions: {
              type: "object",
              properties: {
                pray: { type: "integer", example: 0 },
                peace: { type: "integer", example: 0 },
                candle: { type: "integer", example: 0 }
              }
            },
            user_reactions: {
              type: "object",
              properties: {
                pray: { type: "boolean", example: false },
                peace: { type: "boolean", example: false },
                candle: { type: "boolean", example: false }
              }
            },
            can_react: { type: "boolean", example: true }
          }
        },
        GratitudeEntry: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            content: { type: "string" },
            entry_date: { type: "string", format: "date" },
            created_at: { type: "string", format: "date-time" }
          }
        },
        FutureLetter: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            content: { type: "string", description: "Chỉ hiển thị khi đã mở khóa" },
            open_at: { type: "string", format: "date-time" },
            opened_at: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" }
          }
        },
        Memorial: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            relationship: { type: "string", nullable: true },
            birth_date: { type: "string", format: "date", nullable: true },
            death_date: { type: "string", format: "date", nullable: true },
            avatar_url: { type: "string", format: "uri", nullable: true },
            message: { type: "string", nullable: true },
            visibility: { type: "string", enum: ["private", "public_link"] },
            created_at: { type: "string", format: "date-time" }
          }
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string", enum: ["reaction", "letter", "daily"] },
            title: { type: "string" },
            description: { type: "string" },
            resource_id: { type: "string" },
            created_at: { type: "string", format: "date-time" }
          }
        }
      }
    },
    paths: {
      "/config": {
        get: {
          summary: "Lấy cấu hình chung của hệ thống",
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/ConfigData" },
                      request_id: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/register": {
        post: {
          summary: "Đăng ký tài khoản mới",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email", example: "user@example.com" },
                    password: { type: "string", minLength: 6, example: "password123" },
                    display_name: { type: "string", example: "Nguyễn An" }
                  },
                  required: ["email", "password", "display_name"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Đăng ký thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          session: {
                            type: "object",
                            properties: {
                              access_token: { type: "string" },
                              refresh_token: { type: "string" },
                              expires_at: { type: "integer" },
                              token_type: { type: "string", example: "bearer" }
                            }
                          }
                        }
                      },
                      request_id: { type: "string" }
                    }
                  }
                }
              }
            },
            "400": { description: "Đăng ký thất bại", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        }
      },
      "/auth/login": {
        post: {
          summary: "Đăng nhập tài khoản bằng email & password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email", example: "user@example.com" },
                    password: { type: "string", example: "password123" }
                  },
                  required: ["email", "password"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Đăng nhập thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          session: {
                            type: "object",
                            properties: {
                              access_token: { type: "string" },
                              refresh_token: { type: "string" },
                              expires_at: { type: "integer" },
                              token_type: { type: "string", example: "bearer" }
                            }
                          }
                        }
                      },
                      request_id: { type: "string" }
                    }
                  }
                }
              }
            },
            "401": { description: "Sai thông tin đăng nhập", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        }
      },
      "/auth/refresh": {
        post: {
          summary: "Làm mới access token bằng refresh token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: { type: "string" }
                  },
                  required: ["refresh_token"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Làm mới thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          access_token: { type: "string" },
                          refresh_token: { type: "string" },
                          expires_at: { type: "integer" }
                        }
                      },
                      request_id: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/logout": {
        post: {
          summary: "Đăng xuất tài khoản (hủy session hiện tại)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Đăng xuất thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "object", properties: { logged_out: { type: "boolean", example: true } } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/auth/me": {
        get: {
          summary: "Lấy thông tin tài khoản đăng nhập hiện tại",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/profile": {
        get: {
          summary: "Xem hồ sơ người dùng",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Profile" }
                    }
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Cập nhật hồ sơ người dùng",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    display_name: { type: "string", example: "Nguyễn An" },
                    bio: { type: "string", nullable: true, example: "Tâm bình an, vạn sự an." },
                    avatar_url: { type: "string", format: "uri", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Cập nhật thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Profile" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/profile/avatar": {
        post: {
          summary: "Tải lên ảnh đại diện mới",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    avatar: { type: "string", format: "binary", description: "Tập tin hình ảnh (JPG, PNG, WebP) tối đa 5MB" }
                  },
                  required: ["avatar"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          avatar_url: { type: "string", format: "uri" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/daily-messages/today": {
        get: {
          summary: "Lấy thông điệp bình an của ngày hôm nay",
          description: "Nếu có JWT Bearer token, hệ thống sẽ tự động lưu lại trạng thái người dùng đã mở thông điệp hôm nay.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/DailyMessage" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/prayers": {
        get: {
          summary: "Lấy danh sách lời cầu nguyện công khai của cộng đồng",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Trang hiện tại" },
            { name: "limit", in: "query", schema: { type: "integer", default: 8 }, description: "Số lượng trên mỗi trang" },
            { name: "type", in: "query", schema: { type: "string", enum: ["wish", "gratitude", "memorial", "worry", "peace"] }, description: "Lọc theo chủ đề bình an" }
          ],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/Prayer" } },
                      meta: {
                        type: "object",
                        properties: {
                          page: { type: "integer" },
                          limit: { type: "integer" },
                          total: { type: "integer" },
                          total_pages: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Gửi một lời cầu nguyện/bình an mới",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string", example: "Mong cả nhà luôn mạnh khỏe và bình an." },
                    type: { type: "string", enum: ["wish", "gratitude", "memorial", "worry", "peace"], example: "peace" },
                    visibility: { type: "string", enum: ["private", "public_anonymous"], default: "public_anonymous" },
                    allow_reactions: { type: "boolean", default: true }
                  },
                  required: ["content", "type"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Tạo thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          content: { type: "string" },
                          type: { type: "string" },
                          visibility: { type: "string" },
                          allow_reactions: { type: "boolean" },
                          status: { type: "string" },
                          moderation_required: { type: "boolean", description: "Báo nếu cần admin phê duyệt trước khi hiển thị công khai" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/prayers/{id}": {
        get: {
          summary: "Lấy chi tiết một lời cầu nguyện",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Prayer" }
                    }
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Cập nhật lời cầu nguyện cá nhân",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                    allow_reactions: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Cập nhật thành công" }
          }
        },
        delete: {
          summary: "Xóa lời cầu nguyện cá nhân (soft-delete)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            "200": { description: "Xóa thành công" }
          }
        }
      },
      "/prayers/{id}/reactions": {
        post: {
          summary: "Thêm reaction (Đồng nguyện/Gửi an lành/Thắp nến) cho lời bình an",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reaction_type: { type: "string", enum: ["pray", "peace", "candle"], example: "peace" }
                  },
                  required: ["reaction_type"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Tương tác thành công" }
          }
        },
        delete: {
          summary: "Hủy bỏ reaction cho lời bình an",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    reaction_type: { type: "string", enum: ["pray", "peace", "candle"], example: "peace" }
                  },
                  required: ["reaction_type"]
                }
              }
            }
          },
          responses: {
            "200": { description: "Hủy tương tác thành công" }
          }
        }
      },
      "/reports": {
        post: {
          summary: "Gửi báo cáo vi phạm nội dung",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    target_type: { type: "string", enum: ["prayer", "comment", "memorial"], example: "prayer" },
                    target_id: { type: "string", format: "uuid", example: "d8349283-bc8d-4a11-bcf2-b8832a22cc3d" },
                    reason: { type: "string", example: "Nội dung xúc phạm hoặc thù ghét" }
                  },
                  required: ["target_type", "target_id", "reason"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Báo cáo thành công" }
          }
        }
      },
      "/gratitude": {
        get: {
          summary: "Lấy danh sách nhật ký biết ơn",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "month", in: "query", schema: { type: "integer", example: 6 }, description: "Tháng cần lấy dữ liệu" },
            { name: "year", in: "query", schema: { type: "integer", example: 2026 }, description: "Năm cần lấy dữ liệu" }
          ],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/GratitudeEntry" } }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Tạo ghi chép biết ơn mới",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string", example: "Hôm nay tôi biết ơn vì có thời gian uống trà thanh thản." },
                    entry_date: { type: "string", format: "date", example: "2026-06-21" }
                  },
                  required: ["content"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Ghi chép thành công" }
          }
        }
      },
      "/letters": {
        get: {
          summary: "Lấy danh sách thư gửi tương lai",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/FutureLetter" } }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Tạo một lá thư gửi đến tương lai",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string", example: "Thư gửi tôi 5 năm nữa" },
                    content: { type: "string", example: "Hy vọng lúc này bạn vẫn hạnh phúc và giữ trọn đam mê." },
                    open_at: { type: "string", format: "date-time", example: "2031-06-21T00:00:00.000Z" }
                  },
                  required: ["title", "content", "open_at"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Tạo thư thành công" }
          }
        }
      },
      "/memorials": {
        get: {
          summary: "Lấy danh sách hồ sơ tưởng nhớ người thân đã mất",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/Memorial" } }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Tạo hồ sơ tưởng nhớ người thân mới",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Nguyễn Văn A" },
                    relationship: { type: "string", example: "Ông nội" },
                    birth_date: { type: "string", format: "date", nullable: true, example: "1940-01-01" },
                    death_date: { type: "string", format: "date", nullable: true, example: "2020-05-15" },
                    avatar_url: { type: "string", format: "uri", nullable: true },
                    message: { type: "string", nullable: true, example: "Mãi nhớ thương ông." },
                    visibility: { type: "string", enum: ["private", "public_link"], default: "private" }
                  },
                  required: ["name"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Hồ sơ được tạo thành công" }
          }
        }
      },
      "/notifications": {
        get: {
          summary: "Lấy danh sách thông báo hoạt động tài khoản",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/Notification" } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return Response.json(openapiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  });
}
