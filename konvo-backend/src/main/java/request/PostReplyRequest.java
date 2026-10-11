
package request;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class PostReplyRequest {
    private String content;
    private Long postId;
    private LocalDateTime createdAt;
    private String image;
}